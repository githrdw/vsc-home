import { commands, Uri } from "vscode";
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'openFolder': ({ respond }, { path, newWindow = true }) => {
    commands.executeCommand('vscode.openFolder', Uri.file(path), newWindow)
      .then(() => respond());
  }
};