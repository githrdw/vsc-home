import { Webview } from 'vscode';
import { ExecuteParams, Core } from './d';

import vars from '../vars';

import vsch from './vsch';
import vscode from './vscode';
import workbench from './workbench';

export default class Api {
  core: Core;
  constructor(webview: Webview) {
    this.core = { webview };
    console.log('API Initialized');
    webview.onDidReceiveMessage((params) => this.execute(params));
  }

  private execute({ id, action, payload }: ExecuteParams) {
    const [module, command] = action.split('.');
    const respond = this.generateResponse(id);
    const core = { ...this.core, respond, vars };

    console.log('API Call', id, module);

    if (!module) { console.error('API Module not found'); }
    else if (module === 'vsch') { vsch(core, command, payload); }
    else if (module === 'vscode') { vscode(core, command, payload); }
    else if (module === 'workbench') { workbench(core, command, payload); }
  }

  private generateResponse(id: string) {
    return (payload = {}) => {
      this.core.webview.postMessage({
        id, payload
      });
    };
  }
};