class EventBus {
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

  listener({ data }) {
    console.group(`EB: Receive ${data.id}`);
    const { id, payload } = data;

    if (id) {
      const taskIndex = this.queue.findIndex(({ id: _id }) => id === _id);
      const task = this.queue[taskIndex];
      if (task) {
        console.log('EB: Action', task.action);
        console.log('EB: Payload', payload);
        if (task.cache) {
          console.log('EB: Set cache');
          this.setState(task.action, { ...payload, _task: task });
        }
        console.groupEnd();
        this.queue.splice(taskIndex, 1);
        task.resolve?.({ ...payload, _task: task });
      }
    }
  }

  emit(action, payload, cache = false) {
    const task = {
      id: Math.random().toString(36),
      action,
      payload,
      cache,
    };

    console.group(`EB: Emit ${task.id}`);
    console.log('EB: Action', task.action);
    console.log('EB: Payload', task.payload);

    if (cache) {
      console.log('EB: Get cache');
      const state = this.getState(action);
      console.groupEnd();
      if (state) { return new Promise(resolve => resolve(state)); }
    }
    console.groupEnd();

    this.queue.push(task);
    this.vscode?.postMessage(task);

    return new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
    });
  }

  setState(name, data) {
    const oldState = this.getState() || {};
    const newState = {
      ...oldState,
      [name]: data,
    };
    const jsonData = JSON.stringify(newState);
    this.vscode?.setState(jsonData);
  }

  getState(name = '') {
    const data = this.vscode?.getState();
    if (data) {
      const jsonData = JSON.parse(data);
      if (name) { return jsonData[name] || false; }
      else { return jsonData || false; }
    } else { return false; }
  }

  openFolder(path) {
    console.warn('EB: OpenFolder');
    return this.emit('vscode.openFolder', { path });
  }
}

export default EventBus;
