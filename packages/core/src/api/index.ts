import { Webview, window, ExtensionContext } from 'vscode';
import { ExecuteParams, Payload } from './d';
import CredentialManager from '../utils/CredentialManager'

import vars from '../vars';

import vsch from './vsch';
import vscode from './vscode';
import workbench from './workbench';
import auth from './auth';
import git from './git';

export default class Api {
  nodes: Webview[];
  context: ExtensionContext;
  credentialManager: CredentialManager;
  
  constructor(context: ExtensionContext) {
    this.nodes = [];
    this.context = context;
    this.credentialManager = new CredentialManager(context)
  }

  // Keep track of API Listeners to be able to emit messages to them
  public register(webview: Webview) {
    webview.onDidReceiveMessage(params => this.execute(params, webview));
    this.nodes.push(webview);
  }

  // Destroy callback
  public unregister(webview: Webview) {
    const nodeIndex = this.nodes.indexOf(webview);
    this.nodes.splice(nodeIndex, 1);
  };

  // Execute incoming commands
  private execute({ id, action, payload }: ExecuteParams, webview: Webview) {
    const [module, ...instructions] = action.split('.');
    const respond = this.respondAll(id);
    const core = { respond, vars, webview, ctx: this.context, credentials: this.credentialManager };

    if (!module) { console.error('API Module not found'); }
    else if (module === 'vsch') { vsch(core, instructions, payload); }
    else if (module === 'vscode') { vscode(core, instructions, payload); }
    else if (module === 'workbench') { workbench(core, instructions, payload); }
    else if (module === 'auth') { auth(core, instructions, payload); }
    else if (module === 'git') { git(core, instructions, payload); }
  }

  private respondAll(id: string) {
    return (payload: Payload = { }) => {
      if (payload.error) { window.showErrorMessage(payload.error); };
      this.emitAll({ id, payload });
    };
  }

  // Send message to all subscribed nodes
  public emitAll(data: object) {
    for (const webview of this.nodes) {
      webview.postMessage(data);
    }
  }
};