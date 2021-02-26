import * as vscode from "vscode";
import * as WebView from '@vsch/ui/dist/index.html';
import { join } from 'path';
import vars from '../vars';
import Api from "../api";

export default class SidebarViewLoader implements vscode.WebviewViewProvider {

  private _webview: vscode.Webview | undefined;
  private readonly _assetsPath: string;

  constructor(extensionPath: string) {
    this._assetsPath = join(extensionPath, vars.APP_DIR);
  }
  public resolveWebviewView(
    { webview }: { webview: vscode.Webview },
  ) {
    console.warn("lets create a sidebar");
    this._webview = webview;

    webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this._assetsPath), vscode.Uri.file(vars.USR_APP_DIR)]
    };

    this.getWebviewContent();
    new Api(this._webview);
  }

  private async resolveAsset(path: string, meta: AssetMeta): Promise<AssetContainer> {
    const asset = await import(`@vsch/ui/dist/${path}`);
    const uri = vscode.Uri.file(join(this._assetsPath, asset));
    const url = this._webview?.asWebviewUri(uri).toString() || '';
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
    if (this._webview) { this._webview.html = html; }
  }
}