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
// declare var acquireVsCodeApi: any;

declare class EventBus {
  queue: Task[];
  vscode: any;

  listener({ data }: any): void

  emit(action: string, payload: object, cache?: boolean): any

  setState(name: string, data: object): void

  getState(name: string): object | boolean

  openFolder(path: string): any
}

export default EventBus;