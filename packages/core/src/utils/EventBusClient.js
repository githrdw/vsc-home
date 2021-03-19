class EventBus {
  constructor() {
    console.log('EB: Initialize listener');
    this.callbacks = [];
    this.queue = [];
    this.vscode = window.acquireVsCodeApi?.();
    window.addEventListener('message', msg => this.listener(msg));
  }

  destroy() {
    console.log('EB: Destroy listener');
    window.removeEventListener('message', msg => this.listener(msg));
  }

  listener({ data }) {
    const { id, payload } = data;

    if (id) {
      const taskIndex = this.queue.findIndex(({ id: _id }) => id === _id);
      const task = this.queue[taskIndex];

      if (task) {
        console.log(`EB: Receive ${task.action}`, { task, payload });
        if (task.cache) {
          console.log('EB: Set cache');
          this.setState(task.action, { ...payload, _task: task });
        }
        this.queue.splice(taskIndex, 1);
        task.resolve?.({ ...payload, _task: task });
      }
    }
    if (payload?.action) {
      const callbacks = this.callbacks.filter(({ action }) => action === payload.action);
      if (callbacks.length) {
        for (const { callback } of callbacks) { callback?.(data); };
      }
    }
  }

  on(action, callback) {
    this.callbacks.push({ action, callback });
    return () => { action, callback; };
  }

  off(parameters, isCallback = true) {
    const remove = (_action, _callback) => {
      const callbackIndex = this.callbacks.findIndex(({ action, callback }) => callback === _callback && _action === action);
      if (~callbackIndex) { this.callbacks.splice(callbackIndex, 1); };
    };
    if (Array.isArray(parameters)) {
      for (const { callback, action } of parameters) {
        if (isCallback) { return () => remove(callback, action); }
        else { remove(callback, action); };
      }
    } else {
      const { callback, action } = parameters;
      if (isCallback) { return () => remove(callback, action); }
      else { remove(callback, action); };
    }
  }

  emit(action, payload, cache = false) {
    const task = {
      id: Math.random().toString(36),
      action,
      payload,
      cache,
    };

    console.log(`EB: Emit ${action}`, { task });

    if (cache) {
      const state = this.getState(action);
      console.log('EB: Get cache', { state });
      if (state) { return new Promise(resolve => resolve(state)); }
    }

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
}

export default EventBus;
