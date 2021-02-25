import { Uri, workspace } from "vscode";
import { TextDecoder, TextEncoder } from "util";
import { join } from 'path';
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, command: string, payload: object) {
  run[command](core, payload);
}

const run: Run = {
  'setLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { name = 'default', layout }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${name}.json`);
    const uri = Uri.file(file);
    try {
      const data = JSON.stringify(layout, null, 2);
      const content = new TextEncoder().encode(data);
      await workspace.fs.writeFile(uri, content);
      respond();
    } catch (e) {
      respond({ error: e.toString() + ' while writing ' + file });
    }
  },
  'getLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { name = 'default' }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${name}.json`);
    const uri = Uri.file(file);
    try {
      const data = await workspace.fs.readFile(uri);
      const text = new TextDecoder("utf-8").decode(data);
      const json = text ? JSON.parse(text) : null;
      respond({ layout: json });
    } catch (e) {
      respond({ error: e.toString() + ' while reading ' + file });
    }
  },
  'getCustomWidgets': async ({ respond, vars: { USR_APP_DIR, WIDGETS_ROOT } }) => {
    const dir = join(USR_APP_DIR, WIDGETS_ROOT);
    const uri = Uri.file(dir);
    try {
      const widgets = await workspace.fs.readDirectory(uri);
      respond({ widgets });
    } catch (e) {
      respond({ error: e.toString() + ' while reading ' + dir });
    }
  },
  'loadCustomWidget': ({ respond, webview, vars: { USR_APP_DIR, WIDGETS_ROOT } }, { lib }) => {
    const file = `vsch_${lib}/dist/remoteEntry.js`;
    const uri = Uri.file(join(USR_APP_DIR, WIDGETS_ROOT, file));
    const url = webview.asWebviewUri(uri).toString();
    respond({ path: url });
  }
};