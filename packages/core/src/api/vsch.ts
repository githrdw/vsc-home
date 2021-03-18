import { Uri, workspace, commands, FileType } from "vscode";
import { TextDecoder, TextEncoder } from "util";
import { join } from 'path';
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const command = run[instructions.join('.')];
  if (command) { command(core, payload); }
  else { core.respond({ ...payload, action: instructions.join('.') }); };
}

const run: Run = {
  'ui.open': async ({ respond }) => {
    await commands.executeCommand('vsch.openMainView');
    respond();
  },
  'ui.setData': async ({ respond, vars: { USR_APP_DIR, DATA_ROOT } }, { module, fileName, data }) => {
    const file = join(USR_APP_DIR, DATA_ROOT, module, fileName);
    const uri = Uri.file(file);

    try {
      const text = new TextEncoder().encode(data);
      await workspace.fs.writeFile(uri, text);
      respond();
    } catch (e) {
      respond({ error: e.toString() + ' while writing ' + file });
    }
  },
  'ui.deleteData': async ({ respond, vars: { USR_APP_DIR, DATA_ROOT } }, { module, fileName }) => {
    const file = join(USR_APP_DIR, DATA_ROOT, module, fileName);
    const uri = Uri.file(file);

    try {
      await workspace.fs.delete(uri);
      respond();
    } catch (e) {
      respond({ error: e.toString() + ' while deleting ' + file });
    }
  },
  'ui.getData': async ({ respond, vars: { USR_APP_DIR, DATA_ROOT } }, { module, fileName }) => {
    const file = join(USR_APP_DIR, DATA_ROOT, module, fileName);
    const uri = Uri.file(file);
    let notExisting;
    try {
      const data = await workspace.fs.readFile(uri);
      const text = new TextDecoder("utf-8").decode(data);
      respond({ data: text });
    } catch (e) {
      if (e.code === "FileNotFound") {
        notExisting = true;
      } else {
        respond({ error: e.toString() + ' while reading ' + file });
      }
    }

    if (notExisting) {
      try {
        await workspace.fs.writeFile(uri, new Uint8Array());
        respond({ data: undefined });
      } catch (e) {
        respond({ error: e.toString() + ' while creating ' + file });
      }
    }
  },
  'ui.setLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { name = 'default', layout }) => {
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
  'ui.getLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { name = 'default' }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${name}.json`);
    const uri = Uri.file(file);
    let notExisting;
    try {
      const data = await workspace.fs.readFile(uri);
      const text = new TextDecoder("utf-8").decode(data);
      const json = text ? JSON.parse(text) : null;
      respond({ layout: json });
    } catch (e) {
      if (e.code === "FileNotFound") {
        notExisting = true;
      } else {
        respond({ error: e.toString() + ' while reading ' + file });
      }
    }

    if (notExisting) {
      try {
        await workspace.fs.writeFile(uri, new Uint8Array());
        respond({ layout: undefined });
      } catch (e) {
        respond({ error: e.toString() + ' while creating ' + file });
      }
    }
  },
  'core.getCustomWidgets': async ({ respond, vars: { USR_APP_DIR, WIDGETS_ROOT } }) => {
    const dir = join(USR_APP_DIR, WIDGETS_ROOT);
    const uri = Uri.file(dir);
    let widgetsDetails = [];
    let widgets: [string, FileType][] = [];
    try {
      widgets = await workspace.fs.readDirectory(uri);
    } catch (e) {
      return respond({ error: e.toString() + ' while reading ' + dir });
    }
    for (const widget of widgets) {
      const [path] = widget;
      const lib = path.replace('vsch_', '');
      const packageFile = join(dir, path, 'package.json');
      const packageUri = Uri.file(packageFile);
      try {
        const data = await workspace.fs.readFile(packageUri);
        const text = new TextDecoder("utf-8").decode(data);
        const json = text ? JSON.parse(text) : null;
        if (json) {
          widgetsDetails.push({ lib, ...json.vsch });
        }
      } catch (e) {
        console.error({ error: e.toString() + ' while reading ' + dir });
      }
    }
    respond({ widgets: widgetsDetails });
  },
  'core.loadCustomWidget': ({ respond, webview, vars: { USR_APP_DIR, WIDGETS_ROOT } }, { lib }) => {
    const file = `vsch_${lib}/dist/remoteEntry.js`;
    const uri = Uri.file(join(USR_APP_DIR, WIDGETS_ROOT, file));
    const url = webview.asWebviewUri(uri).toString();
    respond({ path: url });
  }
};