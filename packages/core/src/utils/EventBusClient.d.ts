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

  setState(name: string, data: object): void

  getState(name: string): object | boolean
}

export default EventBus;