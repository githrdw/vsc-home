import * as vscode from 'vscode';
import vars from '../vars';

import WebviewLoader from "../utils/WebviewLoader";

export default class SidebarWebview extends WebviewLoader {
  public resolveWebviewView({ webview, onDidDispose }: { webview: vscode.Webview, onDidDispose: vscode.Event<void> }) {
    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this.assetsPath), vscode.Uri.file(vars.USR_APP_DIR)]
    };

    this.setWebview(webview, onDidDispose);
    this.getWebviewContent();
  }
}