import { Webview, ExtensionContext } from "vscode";
import CredentialManager from "../utils/CredentialManager";

export interface ExecuteParams {
  id: string,
  action: string,
  payload: object
}

export interface Payload {
  error?: string
  stack?: Error["stack"]
}

export interface RespondPayload {
  (payload?: any): void
}

export interface ExecuteCore {
  respond: RespondPayload,
  vars: any,
  webview: Webview
  ctx: ExtensionContext,
  credentials: CredentialManager
}

export interface Run {
  [key: string]: (core: ExecuteCore, payload: any) => void
}