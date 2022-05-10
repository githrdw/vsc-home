import { ExtensionContext, Memento, SecretStorage, workspace } from 'vscode'
const WebSocket = require('ws')

const userConfig = workspace.getConfiguration('home');

interface ProviderIndexes extends Array<{
  providerKey: string,
  accountName: string,
  providerHash: string
}> { }

interface ProviderToken {
  providerHash: string,
  token: string,
  duration: number
}

interface ProviderAccount {
  providerKey: string,
  providerHash: string,
  accountName: string
}

export default class CredentialManager {
  credentials: SecretStorage
  globalState: Memento
  endpoint: string;
  agent: { registered: boolean, id?: string, secret?: string, socket?: WebSocket, loggedIn?: boolean, pendingRefresh?: boolean };
  socket: WebSocket | null
  refreshQueue: Set<(v?: unknown) => void>
  log: Console["log"]

  constructor(ctx: ExtensionContext) {
    this.credentials = ctx.secrets
    this.globalState = ctx.globalState
    this.endpoint = (userConfig.get('oauthAgent') as string).replace(/\/?$/, '/')
    this.agent = { registered: false }
    this.socket = null
    this.refreshQueue = new Set()

    this.log = function () {
      var args = [].slice.call(arguments);
      console.log.apply(console.log, [(new Date()).toISOString() + ' ::'].concat(args));
    };

    ctx.secrets.get('vsch-agent-id')
      .then(id => {
        if (id) ctx.secrets.get('vsch-agent-secret').then(secret => {
          if (secret) this.agent = { registered: true, id, secret }
        })
      })
  }

  async startAgent(endpoint = this.endpoint) {
    try {
      const socket = new WebSocket(endpoint)
      this.socket = socket
      await new Promise<void>((resolve) => {
        socket.addEventListener('open', () => { resolve(); this.log('Socket open') })
        socket.addEventListener('close', () => this.log('Socket closed'))
      })
      return socket
    } catch (e) {
      throw Error("OAuth agent not available: " + e)
    }
  }

  async register(keepAlive = false) {
    const socket = await this.startAgent()
    if (this.agent.id) { throw Error("OAuth agent already registered") }
    if (!socket) { throw Error("OAuth agent not available") }
    else {
      socket.send('REGISTER')
      await new Promise<void>((resolve) => {
        socket.addEventListener('message', async (message: { data: string; }) => {
          const [response, payload] = (message.data as string).split(/\.(.*)/s)
          switch (response) {
            case "REGISTERED": {
              const [id, secret] = payload.split(":")
              await this.credentials.store('vsch-agent-id', id)
              await this.credentials.store('vsch-agent-secret', secret)
              this.agent = { registered: true, id, secret }
              return resolve()
            }
            default: {
              throw Error("OAuth agent registration failed")
            }
          }
        }, { once: true })
      })
    }
    if (!keepAlive) socket.close()
  }

  async login(keepAlive = false) {
    const { id, secret } = this.agent
    const endpoint = this.endpoint + "?publicId=" + id
    const socket = await this.startAgent(endpoint)
    if (socket && id && secret) {
      socket.send('LOGIN.' + secret)
      try {
        await new Promise<void>((resolve, reject) => {
          socket.addEventListener('close', () => {
            this.agent.loggedIn = false
          })
          socket.addEventListener('message', (message: { data: string; }) => {
            const [response] = (message.data as string).split(/\.(.*)/s)
            switch (response) {
              case "LOGGEDIN": {
                this.agent.loggedIn = true
                return resolve()
              }
              default: {
                reject("OAuth agent login failed")
              }
            }
          })
        })
      } catch {
        throw new Error("OAuth agent login failed")
      }
      if (!keepAlive) socket.close()
    } else throw new Error("OAuth agent login failed")
  }

  async logout() {
    await this.credentials.get('vsch-agent-id') && await this.credentials.delete('vsch-agent-id')
    await this.credentials.get('vsch-agent-secret') && await this.credentials.delete('vsch-agent-secret')
    await this.credentials.get('vsch-provider-cache') && await this.credentials.delete('vsch-provider-cache')
    await this.globalState.update('vsch-provider-indexes', undefined)

    this.agent = { registered: false, loggedIn: false }
  }

  async getProviderAccounts(providerKey: string) {
    const indexes: ProviderIndexes | undefined = await this.globalState.get('vsch-provider-indexes')
    return (indexes || []).filter(({ providerKey: _providerKey }) => _providerKey === providerKey)
  }
  async getProviderName(providerHash: string) {
    const indexes: ProviderIndexes | undefined = await this.globalState.get('vsch-provider-indexes')
    return ((indexes || []).find(({ providerHash: _providerHash }) => _providerHash === providerHash) || {}).providerKey
  }

  async updateProviderAccount({ providerKey, providerHash, accountName }: ProviderAccount) {
    const providerIndexes = (await this.globalState.get('vsch-provider-indexes') || []) as ProviderIndexes
    if (accountName) {
      const newProviderIndex = [...providerIndexes, { providerKey, accountName, providerHash }]
      await this.globalState.update('vsch-provider-indexes', newProviderIndex)
    } else {
      // Remove existing provider account if accountName is empty
      const toRemove = providerIndexes.findIndex(({ providerHash: _providerHash }) => providerHash === _providerHash)
      providerIndexes.splice(toRemove, 1)
      const newProviderIndex = [...providerIndexes]
      await this.globalState.update('vsch-provider-indexes', newProviderIndex)
    }
  }

  async updateProviderToken({ providerHash, token, duration }: ProviderToken) {
    const expire = new Date().setSeconds(new Date().getSeconds() + duration - 200)
    const tokenObject = duration > 1 ? { token, duration, expire } : undefined
    const cache = await this.credentials.get('vsch-provider-cache')
    const cachedTokens = cache ? JSON.parse(cache) : {}
    await this.credentials.store('vsch-provider-cache', JSON.stringify({ ...cachedTokens, [providerHash]: tokenObject }))
    return tokenObject || { token: null, duration: -1 }
  }

  async removeProvider(providerKey: string, providerHash: string) {
    const { registered, loggedIn } = this.agent

    if (!registered) await this.register(true)
    else if (!loggedIn) await this.login(true)

    if (!this.socket) throw Error("OAuth agent not available")

    const socket = this.socket

    socket.send('REMOVE_PROVIDER.' + providerHash)
    await new Promise<void>((resolve) => {
      socket.addEventListener('message', (message: { data: string; }) => {
        const [response, payload] = (message.data as string).split(/\.(.*)/s)
        switch (response) {
          case "REMOVED": {
            return resolve()
          }
          default: {
            throw Error("OAuth agent cannot remove provider")
          }
        }
      }, { once: true })
    })
    this.updateProviderToken({ providerHash, token: '', duration: -1 })
    this.updateProviderAccount({ providerKey, providerHash, accountName: '' })
  }

  async addProvider(providerKey: string) {
    const { registered, loggedIn } = this.agent

    if (!registered) await this.register(true)
    else if (!loggedIn) await this.login(true)

    if (!this.socket) throw Error("OAuth agent not available")

    const socket = this.socket

    socket.send('ADD_PROVIDER.' + providerKey)
    const loginUrl = await new Promise<string>((resolve) => {
      socket.addEventListener('message', (message: { data: string; }) => {
        const [response, payload] = (message.data as string).split(/\.(.*)/s)
        switch (response) {
          case "OPEN": {
            return resolve(payload)
          }
          default: {
            throw Error("OAuth agent cannot add provider")
          }
        }
      }, { once: true })
    })
    return loginUrl
  }

  async confirmProvider() {
    if (this.socket && this.socket.readyState === 1) {
      const socket = this.socket
      const providerString = await new Promise<string>((resolve) => {
        const timeout = setTimeout(() => { socket.close(); throw Error("OAuth provider authentication request expired") }, 5 * 60 * 1000)
        socket.addEventListener('message', (message: { data: string; }) => {
          const [response, payload] = (message.data as string).split(/\.(.*)/s)
          switch (response) {
            case "PROVIDER_ADDED": {
              clearTimeout(timeout)
              socket.close();
              return resolve(payload)
            }
          }
        })
      })
      const { providerHash, accountName, provider: providerKey, token, duration } = JSON.parse(providerString)
      // Store public providerHash
      this.updateProviderAccount({ providerKey, providerHash, accountName })

      // Store private token
      await this.updateProviderToken({ providerHash, token, duration })
      return providerHash
    }
  }

  async refreshProvider(providerHash: string) {
    // TODO - check if provider exists
    const { registered, loggedIn } = this.agent

    if (!registered) throw new Error("OAuth agent is not registered yet")
    else if (!loggedIn) await this.login(true)

    if (!this.socket) throw Error("OAuth agent not available")

    const socket = this.socket

    socket.send('REFRESH_PROVIDER.' + providerHash)
    try {
      const tokenObject = await new Promise<{ token: string, duration: number }>((resolve) => {
        socket.addEventListener('message', (message: { data: string; }) => {
          const [response, payload] = (message.data as string).split(/\.(.*)/s)
          switch (response) {
            case "SESSION": {
              try {
                const { token, duration } = JSON.parse(payload)
                return resolve({ token, duration })
              } catch (e) {
                throw new Error("OAuth invalid provider response")
              }
            }
            default: {
              throw Error("OAuth agent error: " + response)
            }
          }
        })
      })
      return await this.updateProviderToken({ providerHash, ...tokenObject })
    } catch (e) {
      console.error(e)
      throw new Error("OAuth agent refresh failed with provider ")
    }
  }

  async invalidateProviderCache(providerHash: string) {
    return await this.updateProviderToken({ providerHash, token: '', duration: -1 })
  }

  async getCachedProviderToken(providerHash: string) {
    const cache = await this.credentials.get('vsch-provider-cache')
    const cachedTokens = JSON.parse(cache || '') || {}
    if (cachedTokens[providerHash]) {
      const cachedToken = cachedTokens[providerHash]
      const { expire, token } = cachedToken
      if (expire > new Date().getTime() && token) {
        return token
      }
    }
    return false
  }

  async getProviderToken(providerHash: string) {
    const queueCallback = () => {
      this.agent.pendingRefresh = false
      if (this.refreshQueue.size) {
        const [nextCall] = this.refreshQueue
        nextCall()
        this.refreshQueue.delete(nextCall)
      } else this.socket?.close()
    }

    const providerKey = await this.getProviderName(providerHash)

    // Cache try 1
    const cachedToken = await this.getCachedProviderToken(providerHash)
    if (cachedToken) { queueCallback(); return { token: cachedToken, providerKey } }

    if (this.agent.pendingRefresh) {
      // Wait until previous refresh is done
      await new Promise((resolve) => {
        this.refreshQueue.add(resolve)
      })
      this.agent.pendingRefresh = true
      // Cache try 2 (after waiting)
      const cachedToken = await this.getCachedProviderToken(providerHash)
      if (cachedToken) { queueCallback(); return { token: cachedToken, providerKey } }
    } else {
      this.agent.pendingRefresh = true
    }

    const { token } = await this.refreshProvider(providerHash)
    queueCallback();
    return { token, providerKey }
  }
}
