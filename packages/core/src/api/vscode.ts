import { commands, Uri, window } from "vscode";
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'openFolder': async ({ respond }, { path, newWindow = true }) => {
    await commands.executeCommand('vscode.openFolder', Uri.file(path), newWindow);
    respond();
  },
  'selectFolder': async ({ respond }, { canSelectFolders, canSelectMany }) => {
    const data = await window.showOpenDialog({ canSelectFolders, canSelectMany });
    respond({ data });
  }
};