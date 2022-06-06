import { commands, Uri, window, env } from "vscode";
import { ExecuteCore, Run } from './d';
import { join } from 'path';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'openFolder': async ({ respond, vars: { USR_APP_DIR, WIDGETS_ROOT, LAYOUTS_ROOT } }, { path, type, newWindow = true }) => {
    if (path === "LAYOUTS_ROOT") { path = join(USR_APP_DIR, LAYOUTS_ROOT); };
    if (path === "WIDGETS_ROOT") { path = join(USR_APP_DIR, WIDGETS_ROOT); };

    const uri = Uri[type === "uri" ? "parse" : "file"](path)
    await commands.executeCommand('vscode.openFolder', uri, newWindow);
    respond();
  },
  'openExternal': async ({ respond }, { url }) => {
    await env.openExternal(Uri.parse(url));
    respond();
  },
  'selectResource': async ({ respond }, { canSelectFolders, canSelectMany, filters }) => {
    const data = await window.showOpenDialog({ canSelectFolders, canSelectMany, filters });
    respond({ data });
  }
};