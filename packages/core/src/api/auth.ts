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
  'addProvider': async ({ respond, credentials }, { providerName }) => {
    if (!providerName) return respond({ error: 'No providerName specified' })
    try {
      const loginUrl = await credentials.addProvider(providerName)
      if (loginUrl) {
        env.openExternal(Uri.parse(loginUrl));
      }
      const providerHash = await credentials.confirmProvider()
      respond({ providerHash });
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
  'getProviderAccounts': async ({ respond, credentials, ctx }, { providerName }) => {
    if (!providerName) return respond({ error: 'No providerName specified' })
    try {
      const data = await credentials.getProviderAccounts(providerName)
      respond(data);
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
  'getProviderToken': async ({ respond, credentials, ctx }, { providerHash }) => {
    if (!providerHash) return respond({ error: 'No providerHash specified' })
    try {
      const token = await credentials.getProviderToken(providerHash)
      respond({ token });
    } catch (e) {
      if (e instanceof Error) respond({ error: e.message, stack: e.stack })
    }
  },
};