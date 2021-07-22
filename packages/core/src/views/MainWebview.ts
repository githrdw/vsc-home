import * as vscode from "vscode";
import vars from '../vars';

import WebviewLoader from "../utils/WebviewLoader";

export default class MainWebview extends WebviewLoader {
  constructor(context: vscode.ExtensionContext, resolver: (path: string) => Promise<any>, uid: string, title: string) {
    super(context, resolver, uid);
    const webviewPanel = vscode.window.createWebviewPanel(
      uid,
      title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this.assetsPath), vscode.Uri.file(vars.USR_APP_DIR)]
      }
    );
    webviewPanel.iconPath = vscode.Uri.file('');

    this.setPanel(webviewPanel);
  }
}