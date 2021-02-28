
import * as vscode from "vscode";
import vars from '../vars';
import Api from "../api";
import { join } from 'path';

export default class WebviewLoader {
  protected readonly _assetsPath: string;
  private readonly _resolver;
  private _webview: vscode.Webview | undefined;

  constructor(extensionPath: string, resolver: (path: string) => Promise<any>) {
    this._assetsPath = join(extensionPath, vars.APP_DIR);
    this._resolver = resolver;
  }

  protected async setWebview(webview: vscode.Webview) {
    this._webview = webview;
    new Api(webview);
  }

  private async resolveAsset(path: string, meta: AssetMeta): Promise<AssetContainer> {
    const asset = await this._resolver(path);
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
    const WebView = await this._resolver('index.html');
    const html = await this.resolveAssetByMatch(WebView, /[\w|-]+\.(js|css)/gm);
    if (this._webview) { this._webview.html = html; }
  }
}