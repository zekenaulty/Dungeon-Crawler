import { List } from './list.js';

export class EventHandler {

  #events = {};

  constructor() {
    
  }

  raiseEvent(event) {
    let vm = this;
    if (!event || !arguments || arguments.length === 0) {
      return;
    }

    let e = vm.#events[event];
    if (!e || !e.dispatch) {
      return;
    }

    e.dispatch.apply(e, Array.prototype.slice.call(arguments).slice(1));
  }

  defineEvent() {
    let vm = this;
    for (let i = 0; i < arguments.length; i++) {
      vm.#events[arguments[i]] = new EventDispatcher(vm);
    }
  }

  listenToEvent(event, action) {
    let vm = this;
    if (!event || !action) {
      return;
    }

    let e = vm.#events[event];
    if (!e) {
      return;
    }

    e.add(action);
  }

  ignoreEvent(event, action) {
    let vm = this;
    if (!event || !action) {
      return;
    }

    let e = vm.#events[event];
    if (!e) {
      return;
    }

    e.remove(action);
  }

  clearEvents() {
    let vm = this;
    let e = vm.#events;
    vm.#events = {};
    for(let p in e) {
      e[p].length = 0;
      delete e[p];
      vm.defineEvent(p);
    }
    e = undefined;
  }
}

class EventDispatcher {
  #listeners = new List();
  #parent;
  
  constructor(parent) {
    let vm = this;
    vm.#parent = parent;
  }

  add(action) {
    let vm = this;
    if (vm.#listeners.includes(action)) {
      return;
    }

    vm.#listeners.push(action);
  }

  remove(action) {
    let vm = this;
    vm.#listeners.delete(action);
  }

  dispatch() {
    let vm = this;
    for (let i = 0; i < vm.#listeners.length; i++) {
      let action = vm.#listeners[i];
      if (action) {
        action.apply(vm.#parent, arguments);
      }
    }
  }
}
