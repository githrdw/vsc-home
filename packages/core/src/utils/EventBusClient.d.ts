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

declare class EventBus {
  queue: Task[];
  vscode: any;

  listener({ data }: any): void

  emit(action: string, payload: object, cache?: boolean): any

  on(action: string, callback: TaskResolve): { action: string, callback: TaskResolve }

  off(parameters: { action: string, callback: TaskResolve }[] | { action: string, callback: TaskResolve }): void

  setState(name: string, data: object): void

  getState(name: string): object | boolean
}

export default EventBus;