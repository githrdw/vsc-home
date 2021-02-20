import * as vscode from "vscode";
import * as WebView from '@vsch/ui/dist/index.html';
import { join } from 'path';

const APP_DIR = './dist';
const USR_ROOT = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const USR_APP_DIR = join(USR_ROOT, 'vsc-home');

export default class WebviewLoader {
  private readonly _panel: vscode.WebviewPanel;
  private readonly _assetsPath: string;

  constructor(extensionPath: string) {
    this._assetsPath = join(extensionPath, APP_DIR);

    this._panel = vscode.window.createWebviewPanel(
      "home",
      "Home",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this._assetsPath), vscode.Uri.file(USR_APP_DIR)]
      }
    );
    vscode.commands.executeCommand('workbench.action.pinEditor');

    this._panel.webview.onDidReceiveMessage((msg) => {
      const { id, action, payload } = msg;
      const respond = (payload = {}) => this._panel.webview.postMessage({ id, payload });
      console.warn('RECEIVED', action);
      switch (action) {
        case 'init': {
          vscode.commands.executeCommand('_workbench.getRecentlyOpened')
            .then(recent => {
              respond({ recent });
            });

        }
        case 'vscode.openFolder': {
          console.warn({ msg, uri: vscode.Uri.file(payload.path) });
          vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(payload.path), true)
            .then(() => respond());
        }
        case 'vsch.loadWidget': {
          const uri = vscode.Uri.file(join(USR_APP_DIR, 'app2/dist/remoteEntry.js'));
          const url = this._panel.webview.asWebviewUri(uri).toString();
          respond({
            path: url
          });
        }
      }
    },
    );
  }

  private async resolveAsset(path: string, meta: AssetMeta): Promise<AssetContainer> {
    const asset = await import(`@vsch/ui/dist/${path}`);
    const uri = vscode.Uri.file(join(this._assetsPath, asset));
    const url = this._panel.webview.asWebviewUri(uri).toString();
    return { url, ...meta };
  }

  private resolveAssetByMatch(string: string, match: RegExp): Promise<string> {
    return new Promise((resolve) => {
      const assetBuffer: AssetBuffer = [];
      const matchFactory = string.matchAll(match);

      for (const { 0: { length }, 0: asset, index } of matchFactory) {
        // Create resolvable buffer with asset-urls and position meta
        assetBuffer.push(this.resolveAsset(asset, {
          length,
          index
        }));
      }

      let newString = string;

      // Loop through each assets[].url
      Promise.all(assetBuffer).then((assets: AssetContainer[]) => {
        for (const { length, index, url } of assets) {
          const position = newString.length - string.length + (index || 0);
          // Replace match with resolved assets[].url
          newString = newString.substr(0, position) + url + newString.substr(position + length);
        }
        resolve(newString);
      });
    });
  }

  public async getWebviewContent() {
    const html = await this.resolveAssetByMatch(WebView, /\w+\.(js|css)/gm);
    // const APPLOG = this._panel.webview.asWebviewUri(vscode.Uri.file(join(USR_APP_DIR, 'log.js'))).toString();
    // const html = WebView.replace('APPLOG', APPLOG);
    this._panel.webview.html = html;
  }
}