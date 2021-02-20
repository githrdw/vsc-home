import { Webview } from "vscode";

export type Core = {
  webview: Webview
};

export interface ExecuteParams {
  id: string,
  action: string,
  payload: object
}

export interface Payload {
  error?: string
}

export interface RespondPayload {
  (payload?: any): void
}

export interface ExecuteCore extends Core {
  vars: any,
  respond: RespondPayload
}

export interface Run {
  [key: string]: (core: ExecuteCore, payload: any) => void
}