import { Uri, env } from "vscode";
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'agentStatus': async ({ respond, credentials }) => {
    respond(credentials.agent);
  },
  'register': async ({ respond, credentials }) => {
    try {
      await credentials.register()
      const { registered, id } = credentials.agent
      respond({ id, registered });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'login': async ({ respond, credentials }) => {
    try {
      await credentials.login()
      const { id, registered, loggedIn } = credentials.agent
      respond({ id, registered, loggedIn });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'logout': async ({ respond, credentials }) => {
    // TODO - unregister account in agent
    await credentials.logout()
    respond();
  },
  'addProvider': async ({ respond, credentials }, { providerKey }) => {
    if (!providerKey) return respond({ error: 'No providerKey specified' })
    try {
      const loginUrl = await credentials.addProvider(providerKey)
      if (loginUrl) {
        env.openExternal(Uri.parse(loginUrl));
      }
      const providerHash = await credentials.confirmProvider()
      respond({ providerHash });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'removeProvider': async ({ respond, credentials }, { provider, providerHash }) => {
    if (!providerHash) return respond({ error: 'No providerHash specified' })
    try {
      await credentials.removeProvider(provider, providerHash)
      respond();
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'invalidateProviderCache': async ({ respond, credentials }, { providerHash }) => {
    if (!providerHash) return respond({ error: 'No providerHash specified' })
    try {
      const { token, duration } = await credentials.invalidateProviderCache(providerHash)
      respond({ token, duration });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'refreshProvider': async ({ respond, credentials }, { providerHash }) => {
    if (!providerHash) return respond({ error: 'No providerHash specified' })
    try {
      const { token, duration } = await credentials.refreshProvider(providerHash)
      respond({ token, duration });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'getProviderAccounts': async ({ respond, credentials, ctx }, { providerKey }) => {
    if (!providerKey) return respond({ error: 'No providerKey specified' })
    try {
      const data = await credentials.getProviderAccounts(providerKey)
      respond(data);
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'getProviderToken': async ({ respond, credentials, ctx }, { providerHash }) => {
    if (!providerHash) return respond({ error: 'No providerHash specified' })
    try {
      const tokenObject = await credentials.getProviderToken(providerHash)
      respond(tokenObject);
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
};