import { Uri, workspace, commands, FileType, window } from "vscode";
import { TextDecoder, TextEncoder } from "util";
import { join } from 'path';
import { ExecuteCore, Run } from './d';

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const command = run[instructions.join('.')];
  if (command) { command(core, payload); }
  else { core.respond({ ...payload, action: instructions.join('.') }); };
}

const run: Run = {
  'ui.open': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { uid }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${uid}.json`);
    const uri = Uri.file(file);
    let title = 'Home';

    try {
      const data = await workspace.fs.readFile(uri);
      const text = new TextDecoder("utf-8").decode(data);
      const json = text ? JSON.parse(text) : null;
      if (json.title) { title = json.title; };
    } catch (e) {
      console.log(e);
    }

    await commands.executeCommand('vsch.openMainView', { uid, title });
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
  'ui.addLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }) => {
    const title = await window.showInputBox({ prompt: 'New layout name' });
    if (!title) { return; };

    const uid = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    let file = join(USR_APP_DIR, LAYOUTS_ROOT, `${uid}.json`);
    let uri = Uri.file(file);

    let exists;
    try {
      await workspace.fs.readFile(uri);
    } catch (e) { if (e.code === "FileNotFound") { exists = false; }; }

    if (exists !== false) {
      const hash = Math.random().toString(36).substr(2, 5);
      file = join(USR_APP_DIR, LAYOUTS_ROOT, `${uid}_${hash}.json`);
      uri = Uri.file(file);
    }

    try {
      const content = JSON.stringify({ title, layout: [] }, null, 2);
      const data = new TextEncoder().encode(content);

      await workspace.fs.writeFile(uri, data);
      await commands.executeCommand('vsch.openMainView', { uid, title });
      respond();
    } catch (e) {
      respond({ error: e.toString() + ' while writing ' + file });
    }
  },
  'ui.setLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { uid = 'default', layout }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${uid}.json`);
    const uri = Uri.file(file);
    try {
      const currentFile = await workspace.fs.readFile(uri);
      const currentData = new TextDecoder("utf-8").decode(currentFile);
      const currentJSON = currentData ? JSON.parse(currentData) : {};
      const content = JSON.stringify({ ...currentJSON, layout }, null, 2);
      const data = new TextEncoder().encode(content);

      await workspace.fs.writeFile(uri, data);
      respond();
    } catch (e) {
      respond({ error: e.toString() + ' while writing ' + file });
    }
  },
  'ui.getLayout': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }, { uid = 'default' }) => {
    const file = join(USR_APP_DIR, LAYOUTS_ROOT, `${uid}.json`);
    const uri = Uri.file(file);
    let notExisting;
    try {
      const data = await workspace.fs.readFile(uri);
      const text = new TextDecoder("utf-8").decode(data);
      const json = text ? JSON.parse(text) : null;
      respond(json);
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
  'ui.getLayouts': async ({ respond, vars: { USR_APP_DIR, LAYOUTS_ROOT } }) => {
    const dir = join(USR_APP_DIR, LAYOUTS_ROOT);
    const uri = Uri.file(dir);
    const layoutsDetails = [];
    let layouts: [string, FileType][] = [];
    try {
      layouts = await workspace.fs.readDirectory(uri);
    } catch (e) {
      return respond({ error: e.toString() + ' while reading ' + dir });
    }
    for (const layout of layouts) {
      const [path] = layout;
      if (path === 'default.json') { continue; }
      const layoutFile = join(dir, path);
      const layoutUri = Uri.file(layoutFile);
      try {
        const data = await workspace.fs.readFile(layoutUri);
        const text = new TextDecoder("utf-8").decode(data);
        const json = text ? JSON.parse(text) : null;
        const uid = path.replace(/.json$/, '');
        if (json) {
          layoutsDetails.push({ title: json.title || 'Home', uid });
        }
      } catch (e) {
        console.error({ error: e.toString() + ' while reading ' + dir });
      }
    }
    respond({ layouts: [{ title: 'Home', uid: 'default' }, ...layoutsDetails] });
  },
  'core.getCustomWidgets': async ({ respond, vars: { USR_APP_DIR, WIDGETS_ROOT } }) => {
    const dir = join(USR_APP_DIR, WIDGETS_ROOT);
    const uri = Uri.file(dir);
    const widgetsDetails = [];
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