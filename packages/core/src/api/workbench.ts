import { commands } from "vscode";
import { Run, ExecuteCore } from './d';

export default function (core: ExecuteCore, command: string, payload: object) {
  run[command](core, payload);
}

const run: Run = {
  'geetRecentlyOpened': ({ respond }) => {
    commands.executeCommand('_workbench.getRecentlyOpened')
      .then(recent => {
        respond({ recent });
      });
  }
};