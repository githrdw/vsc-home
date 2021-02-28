import * as vscode from 'vscode';
import vars from '../vars';

import WebviewLoader from "../utils/WebviewLoader";

export default class SidebarWebview extends WebviewLoader {
  public resolveWebviewView({ webview }: { webview: vscode.Webview }) {
    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this._assetsPath), vscode.Uri.file(vars.USR_APP_DIR)]
    };

    this.setWebview(webview);
    this.getWebviewContent();
  }
}