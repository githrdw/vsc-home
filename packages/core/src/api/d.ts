import { Webview, ExtensionContext } from "vscode";

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

export interface ExecuteCore {
  respond: RespondPayload,
  vars: any,
  webview: Webview
  ctx: ExtensionContext
}

export interface Run {
  [key: string]: (core: ExecuteCore, payload: any) => void
}