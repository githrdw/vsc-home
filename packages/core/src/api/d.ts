import { Webview } from "vscode";

export type Core = {
  webview: Webview
};

export interface ExecuteParams {
  id: string,
  action: string,
  payload: object
}

export interface ExecuteCore extends Core {
  vars: any,
  respond: {
    (payload?: object): void
  }
}

export interface Run {
  [key: string]: (core: ExecuteCore, payload: any) => void
}