import * as vscode from "vscode";
import { join } from 'path';
import { default as WebView } from 'raw-loader!../lib/ui/index.html';

const UI_DIR = "./lib/ui";

export default class WebviewLoader {
  private readonly _panel: vscode.WebviewPanel;
  private readonly _assetsPath: string;

  constructor(extensionPath: string) {
    this._assetsPath = join(extensionPath, UI_DIR);
    this._panel = vscode.window.createWebviewPanel(
      "configView",
      "Config View",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this._assetsPath)]
      }
    );
    const html = this.getWebviewContent();
    this._panel.webview.html = html;
    this._panel.webview.onDidReceiveMessage(
      async message => {
        console.log("MESSAGE");
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

  private resolveAssets(path: string): string {
    const uri = vscode.Uri.file(join(this._assetsPath, path));
    return this._panel.webview.asWebviewUri(uri).toString();
  }

  private getWebviewContent(): string {
    const wv =  WebView
      .replace(/\w+\.(js|css)/gm,
        (match) => this.resolveAssets(match));
    console.warn({wv});
    return wv;
  }
}