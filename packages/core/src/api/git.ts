import { commands, Uri, extensions } from "vscode";
import { ExecuteCore, Run } from './d';

const extension = extensions.getExtension('vscode.git')

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  if (extension && extension.isActive) {
    const [command] = instructions;
    run[command](core, payload);
  } else {
    core.respond({ error: 'Git extension not ready' })
  }
}

const run: Run = {
  'clone': async ({ respond }, { url, path }) => {
    const dir = Uri.file(path)
    await commands.executeCommand('git.clone', url, dir.fsPath)
    respond()
  }
};