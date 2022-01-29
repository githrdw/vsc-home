import * as vscode from "vscode";
import vars from '../vars';
import { join } from 'path';

export default class WebviewLoader {
  protected readonly assetsPath: string;
  protected webviewCallback: ((webview: vscode.Webview) => any) | undefined;
  protected destroyCallback: ((webview: vscode.Webview) => void) | undefined;
  protected externalDestroyCallback: ((webview: vscode.Webview) => void) | undefined;
  private readonly getAsset;
  private subscriptions;
  private generateNonce: () => string;
  public webview: vscode.Webview | undefined;
  public panel: vscode.WebviewPanel | undefined;
  public vsch_uid: string;

  constructor(context: vscode.ExtensionContext, resolver: (path: string) => Promise<any>, uid: string) {
    this.webviewCallback = undefined;
    this.subscriptions = context.subscriptions;
    this.assetsPath = join(context.extensionPath, vars.APP_DIR);
    this.getAsset = resolver;
    this.vsch_uid = uid;
    this.generateNonce = () => {
      let t = ""; const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let o = 0; o < 32; o++) { t += n.charAt(Math.floor(Math.random() * n.length)); } return t;
    };
  }

  // Callback when Webview is set, returns destroyCallback that is fired when webview destroys
  public onReady(callback: (webview: vscode.Webview) => any) {
    if (this.webview) {
      this.destroyCallback = callback(this.webview);
    } else {
      this.webviewCallback = callback;
    };
  }

  public onDestroy(callback: (webview: vscode.Webview) => void) {
    this.externalDestroyCallback = callback;
  }

  protected setPanel(panel: vscode.WebviewPanel) {
    const { webview, onDidDispose } = panel;
    this.panel = panel;
    this.webview = webview;

    this.destroyCallback = this.webviewCallback?.(webview);
    onDidDispose(() => {
      this.externalDestroyCallback?.(webview);
      this.destroyCallback?.(webview);
    }, null, this.subscriptions);
  }

  protected setWebview(webview: vscode.Webview, onDidDispose: vscode.Event<void>) {
    this.webview = webview;
    this.destroyCallback = this.webviewCallback?.(webview);
    onDidDispose(() => {
      this.externalDestroyCallback?.(webview);
      this.destroyCallback?.(webview);
    }, null, this.subscriptions);
  }

  private async resolveAsset(path: string, meta: AssetMeta): Promise<AssetContainer> {
    const asset = await this.getAsset(path);
    const uri = vscode.Uri.file(join(this.assetsPath, asset));
    const url = this.webview?.asWebviewUri(uri).toString() || '';
    return { url, ...meta };
  }

  private async resolveAssetByMatch(string: string, match: RegExp): Promise<string> {
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
    const assets = await Promise.all<AssetContainer>(assetBuffer);
    for (const { length, index, url } of assets) {
      const position = newString.length - string.length + (index || 0);
      // Replace match with resolved assets[].url
      newString = newString.substring(0, position) + url + newString.substring(position + length);
    }
    
    return newString
  }
  public async getWebviewContent() {
    const nonce = this.generateNonce();
    const WebView = await this.getAsset('index.html');
    const resolved = await this.resolveAssetByMatch(WebView, /[\w|-]+\.(js|css|svg)/gm);
    const html = resolved
      .replace(/VSCH_UID = 'default'/, `VSCH_UID = '${this.vsch_uid}'`)
      .replace(/CSP_SOURCE/gm, this.webview?.cspSource || '')
      .replace(/CSP_NONCE/gm, nonce)
      .replace(/<script/gm, `<script nonce="${nonce}"`)
      .replace(/rel="stylesheet"/gm, `rel="stylesheet" nonce="${nonce}"`);

    if (this.webview) { this.webview.html = html; }
  }
}