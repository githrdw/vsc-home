import * as vscode from "vscode";
import * as WebView from '@vsch/ui/dist/index.html';
import { join } from 'path';

const APP_DIR = './dist';

export default class WebviewLoader {
  private readonly _panel: vscode.WebviewPanel;
  private readonly _assetsPath: string;

  constructor(extensionPath: string) {
    this._assetsPath = join(extensionPath, APP_DIR);

    this._panel = vscode.window.createWebviewPanel(
      "configView",
      "Config View",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this._assetsPath)]
      }
    );

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'init':
            const recent = await vscode.commands.executeCommand('_workbench.getRecentlyOpened');
            this._panel.webview.postMessage({
              recent
            });
            return 1;
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
    this._panel.webview.html = html;
  }
}