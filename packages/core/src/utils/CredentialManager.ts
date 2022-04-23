import { ExtensionContext, Memento, SecretStorage, workspace } from 'vscode'
const WebSocket = require('ws')

const userConfig = workspace.getConfiguration('home');

interface ProviderIndexes {
  [index: string]: {
    accountName: string,
    providerHash: string
  }[]
}

interface ProviderToken {
  providerHash: string,
  token: string,
  duration: number
}

interface ProviderAccount {
  provider: string,
  providerHash: string,
  accountName: string
}

export default class CredentialManager {
  credentials: SecretStorage
  globalState: Memento
  endpoint: string;
  agent: { registered: boolean, id?: string, secret?: string, socket?: WebSocket, loggedIn?: boolean };

  constructor(ctx: ExtensionContext) {
    this.credentials = ctx.secrets
    this.globalState = ctx.globalState
    this.endpoint = (userConfig.get('oauthAgent') as string).replace(/\/?$/, '/')
    this.agent = { registered: false }
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
      this.agent.socket = socket
      await new Promise<void>((resolve) => {
        socket.addEventListener('open', () => resolve(), { once: true })
        socket.addEventListener('close', () => console.log('Socket closed'), { once: true })
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
        })
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
          }, { once: true })
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
    await this.credentials.delete('vsch-agent-id')
    await this.credentials.delete('vsch-agent-secret')
    await this.credentials.delete('vsch-provider-cache')
    await this.globalState.update('vsch-provider-indexes', undefined)

    this.agent = { registered: false, loggedIn: false }
  }

  async getProviderAccounts(providerName: string) {
    const indexes: ProviderIndexes | undefined = await this.globalState.get('vsch-provider-indexes')
    return (indexes || {})[providerName] || []
  }

  async updateProviderAccount({ provider, providerHash, accountName }: ProviderAccount) {
    const providerIndexes = (await this.globalState.get('vsch-provider-indexes') || {}) as ProviderIndexes
    const providerIndex = providerIndexes[provider] || []
    const newProviderIndex = { ...providerIndexes, [provider]: [...providerIndex, { accountName, providerHash }] }
    await this.globalState.update('vsch-provider-indexes', newProviderIndex)
  }

  async updateProviderToken({ providerHash, token, duration }: ProviderToken) {
    const expire = new Date().setSeconds(new Date().getSeconds() + duration - 200)
    const tokenObject = { token, duration, expire }
    const cache = await this.credentials.get('vsch-provider-cache')
    const cachedTokens = cache ? JSON.parse(cache) : {}
    await this.credentials.store('vsch-provider-cache', JSON.stringify({ ...cachedTokens, [providerHash]: tokenObject }))
    return tokenObject
  }
  
  async addProvider(providerName: string) {
    const { registered, loggedIn } = this.agent

    if (!registered) await this.register(true)
    else if (!loggedIn) await this.login(true)

    if (!this.agent.socket) throw Error("OAuth agent not available")

    const socket = this.agent.socket

    socket.send('ADD_PROVIDER.' + providerName)
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
    if (this.agent.socket && this.agent.socket.readyState === 1) {
      const socket = this.agent.socket
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
      const { providerHash, accountName, provider, token, duration } = JSON.parse(providerString)
      // Store public providerHash
      this.updateProviderAccount({ provider, providerHash, accountName })

      // Store private token
      await this.updateProviderToken({ providerHash, token, duration })
    }
  }

  async refreshProvider(providerHash: string) {
    // TODO - check if provider exists
    const { registered, loggedIn } = this.agent

    if (!registered) throw new Error("OAuth agent is not registered yet")
    else if (!loggedIn) await this.login(true)

    if (!this.agent.socket) throw Error("OAuth agent not available")

    const socket = this.agent.socket

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
    } finally {
      socket.close()
    }
  }

  async getProviderToken(providerHash: string) {
    const cache = await this.credentials.get('vsch-provider-cache')
    const cachedTokens = JSON.parse(cache || '') || {}
    if (cachedTokens[providerHash]) {
      const cachedToken = cachedTokens[providerHash]
      const { expire, token } = cachedToken
      if (expire < new Date().getTime()) {
        const newSession = await this.refreshProvider(providerHash)
        return newSession.token
      } else {
        return token
      }
    } else {
      const newSession = await this.refreshProvider(providerHash)
      return newSession.token
    }
  }
}
