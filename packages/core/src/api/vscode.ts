import { commands, Uri, window } from "vscode";
import { ExecuteCore, Run } from './d';
import { join } from 'path';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'openFolder': async ({ respond, vars: { USR_APP_DIR, WIDGETS_ROOT, LAYOUTS_ROOT } }, { path, newWindow = true }) => {
    if (path === "LAYOUTS_ROOT") { path = join(USR_APP_DIR, LAYOUTS_ROOT); };
    if (path === "WIDGETS_ROOT") { path = join(USR_APP_DIR, WIDGETS_ROOT); };
    
    await commands.executeCommand('vscode.openFolder', Uri.file(path), newWindow);
    respond();
  },
  'selectFolder': async ({ respond }, { canSelectFolders, canSelectMany }) => {
    const data = await window.showOpenDialog({ canSelectFolders, canSelectMany });
    respond({ data });
  }
};