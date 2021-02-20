import { Uri } from "vscode";
import { join } from 'path';
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, command: string, payload: object) {
  run[command](core, payload);
}

const run: Run = {
  'loadWidget': ({ respond, webview, vars: { USR_APP_DIR } }) => {
    const uri = Uri.file(join(USR_APP_DIR, 'app2/dist/remoteEntry.js'));
    const url = webview.asWebviewUri(uri).toString();
    respond({ path: url });
  }
};