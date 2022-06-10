interface Task {
  id: string;
  action: string;
  payload: object;
  resolve?: TaskResolve;
  reject?: Function;
  cache: Boolean;
}
interface TaskResolve {
  (resolve: object): void;
}

declare class EventBusCommands {
  /**
   * Gets a list of recently opened folders, workspaces and files
   */
  emit(action: 'workbench.getRecentlyOpened', options: {}, cache?: boolean):
    Promise<{ recent: { workspaces: any[], files: any[] } }>
  /**
   * Opens the devtools of VSCode
   */
  emit(action: 'workbench.openDevtools', options: {}):
    Promise<void>
  /**
 * Opens folder in VSCode
 */
  emit(action: 'vscode.openFolder', options: { path: string, type?: 'uri' | string, newWindow?: true }):
    Promise<void>
  /**
   * Opens an external resource (like a browser)
   */
  emit(action: 'vscode.openExternal', options: { url: string }):
    Promise<void>
  /**
   * Opens a file browser dialog and returns the selected file(s) and/or folder(s)
   * For `filters` see VSCode docs; window.showOpenDialog
   */
  emit(action: 'vscode.selectResource', options: { canSelectFolders?: boolean, canSelectMany?: boolean, filters?: false | { [name: string]: string[] } }):
    Promise<{ data: { path: string }[] }>

  /**
   * Clones a Git repo if there is access to it and if the Git extension is working properly
   */
  emit(action: 'git.clone', options: { url: string, path: string }):
    Promise<void>
  /**
   * Opens a new UI view according to specified UID
   */
  emit(action: 'vsch.ui.open', options: { uid: string }):
    Promise<void>
  /**
   * Writes data to the data folder where extensions can store textfiles (like HTML)
   */
  emit(action: 'vsch.ui.setData', options: { module: string, fileName: string, data: string }):
    Promise<void>
  /**
   * Deletes data from the data folder where extensions stored textfiles (like HTML)
   */
  emit(action: 'vsch.ui.deleteData', options: { module: string, fileName: string }):
    Promise<void>
  /**
   * Gets data from the data folder where extensions stored textfiles (like HTML)
   */
  emit(action: 'vsch.ui.getData', options: { module: string, fileName: string }):
    Promise<{ data: string }>
  /**
   * Prompts for a new layout name and creates a new layout file
   */
  emit(action: 'vsch.ui.addLayout', options: { module: string, fileName: string }):
    Promise<void>
  /**
   * Updates layout data for specified UID
   * See ui/src/components/widget/types.ts > WidgetProps for widget props
   */
  emit(action: 'vsch.ui.setLayout', options: { uid: 'default' | string, layout: any[] }):
    Promise<void>
  /**
   * Gets layout data for specified UID
   * See ui/src/components/widget/types.ts > WidgetProps for widget props
   */
  emit(action: 'vsch.ui.getLayout', options: { uid: 'default' | string }):
    Promise<{ layout: any[] }>
  /**
   * Gets all layouts
   */
  emit(action: 'vsch.ui.getLayouts', options: { uid: 'default' | string }):
    Promise<{ layouts: { title: string, uid: string }[] }>
  /**
   * Gets all custom widgets in widgets directory
   */
  emit(action: 'vsch.core.getCustomWidgets', options: { uid: 'default' | string }):
    Promise<{ widgets: any[] }>
  /**
    * Returns the location of a custom widget it's remoteEntry.js file
    */
  emit(action: 'vsch.core.loadCustomWidget', options: { lib: string }):
    Promise<{ path: string }>

  /**
    * Emits the editmode state for specified UID
    */
  emit(action: 'vsch.ui.editmodeState', options: { active: boolean, uid: 'default' | string }):
    Promise<{ path: string }>
  /**
   * Opens a file browser dialog and returns the selected file(s) and/or folder(s)
   * For `filters` see VSCode docs; window.showOpenDialog
   */
  emit(action: 'vscode.selectResource', options: { canSelectFolders?: boolean, canSelectMany?: boolean, filters?: false | { [name: string]: string[] } }):
    Promise<{ data: { path: string }[] }>

  /**
   * Private auth functions
   */
  emit(action: 'auth.getProviderToken', options: any): Promise<any>
  emit(action: 'auth.getProviderAccounts', options: any): Promise<any>
  emit(action: 'auth.addProvider', options: any): Promise<any>
  emit(action: 'auth.removeProvider', options: any): Promise<any>

  /**
   * Public auth function to retrieve a token for the provider that matches the providerHash
   * A `providerHash` can be obtained using `vsch.ui.requestAuthentication`
   */
  emit(action: 'vsch.ui.getProviderToken', options: { providerHash: string }):
    Promise<{ token: string, providerKey: string }>
  /**
   * Public auth function to get access to a provider. It will return a providerHash to obtain a token
   * The user has to approve this request first.
   * `_node` can be skipped and is for internal purposes
   */
  emit(action: 'vsch.ui.requestAuthentication', options: { providerKey: 'BITBUCKET' | 'GITLAB' | 'GITHUB', _node?: string }):
    Promise<{ providerHash: string }>

}

declare class EventBus extends EventBusCommands {
  queue: Task[];
  vscode: any;

  listener({ data }: any): void

  resolveById(action: string, id: string, payload: object): void

  exportPublic(node?: string): { emit: EventBusCommands["emit"] }

  on(action: string, callback: TaskResolve): { action: string, callback: TaskResolve }

  off(parameters: { action: string, callback: TaskResolve }[] | { action: string, callback: TaskResolve }): void

  setState(name: string, data: object): void

  getState(name: string): object | boolean
}



export default EventBus;