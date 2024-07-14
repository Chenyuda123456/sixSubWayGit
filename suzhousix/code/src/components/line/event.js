/*
 *@description: 事件处理
 */
export default class EventEmitter {
  constructor() {
    this.listeners = {};
    this.maxListener = 10;
  }

  on(event, cb) {
    let listeners = this.listeners;
    if (listeners[event] && listeners[event].length >= this.maxListener) {
      throw console.error('Maxlisterner number is d%', this.maxListener);
    }
    if (listeners[event] instanceof Array) {
      if (listeners[event].indexOf(cb) === -1) {
        listeners[event].push(cb);
      }
    } else {
      listeners[event] = [].concat(cb);
    }
  }

  emit(...args) {
    let event = args.shift();
    this.listeners[event] &&
      this.listeners[event].forEach(cb => {
        cb.apply(null, args);
      });
  }

  removeListener(event, listener) {
    let listeners = this.listeners;
    let arr = listeners[event] || [];
    let i = arr.indexOf(listener);
    if (i >= 0) {
      listeners[event].splice(i, 1);
    }
  }

  once(event, listener) {
    let fn = (...args) => {
      this.removeListener(event, fn);
      listener(args); // 是否要用apply
    };
    this.on(event, fn);
  }

  removeAllListeners(event) {
    let listeners = this.listeners;
    if (listeners[event]) {
      // 移除单个或者所有
      // listeners[event] = []
      delete listeners[event];
    } else {
      let keys = Object.keys(listeners);
      console.log(keys);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        this.removeAllListeners(key);
      }
      this.listeners = Object.create({});
    }
  }

  setMaxListeners(num) {
    this.maxListener = num;
  }
}
