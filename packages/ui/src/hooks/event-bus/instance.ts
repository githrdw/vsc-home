interface Task {
  id: string;
  action: string;
  payload: object;
  resolve?: TaskResolve;
  reject?: Function;
}
interface TaskResolve {
  (resolve: object): void;
}

class EventBus {
  queue: Task[];
  vscode: any;

  constructor() {
    console.log('EB: Initialize listener');
    this.queue = [];
    this.vscode = window.acquireVsCodeApi?.();
    window.addEventListener('message', msg => this.listener(msg));
  }

  destroy() {
    console.log('EB: Destroy listener');
    window.removeEventListener('message', msg => this.listener(msg));
  }

  listener({ data }: any) {
    console.group(data.id);
    const { id, payload } = data;

    if (id) {
      const taskIndex = this.queue.findIndex(({ id: _id }) => id === _id);
      const task = this.queue[taskIndex];
      if (task) {
        console.log(`EB: Task '${task.action}'`);
        console.log('EB: Payload', payload);
        console.groupEnd();
        task.resolve?.({ ...payload, _task: task });
        this.queue.splice(taskIndex, 1);
      }
    }
  }

  emit(action: string, payload: object) {
    const task: Task = {
      id: Math.random().toString(36),
      action,
      payload,
    };

    console.log('EB: Emit', task.id);

    this.queue.push(task);
    this.vscode?.postMessage(task);

    return new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
    });
  }

  openFolder(path: string) {
    console.warn('EB: OpenFolder');
    return this.emit('vscode.openFolder', { path });
  }
}

export default EventBus;
