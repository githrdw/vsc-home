import { commands } from "vscode";
import { Run, ExecuteCore } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const [command] = instructions;
  run[command](core, payload);
}

const run: Run = {
  'getRecentlyOpened': ({ respond }) => {
    commands.executeCommand('_workbench.getRecentlyOpened')
      .then(recent => {
        respond({ recent });
      });
  }
};