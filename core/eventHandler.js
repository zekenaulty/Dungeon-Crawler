import { List } from './list.js';

export class EventHandler {

  #events = {};

  constructor() {
    
  }

  raiseEvent(event) {
    if (!event || !arguments || arguments.length === 0) {
      return;
    }

    let e = this.#events[event];
    if (!e || !e.dispatch) {
      return;
    }

    e.dispatch.apply(e, Array.prototype.slice.call(arguments).slice(1));
  }

  defineEvent() {
    for (let i = 0; i < arguments.length; i++) {
      this.#events[arguments[i]] = new EventDispatcher(this);
    }
  }

  listenToEvent(event, action) {
    if (!event || !action) {
      return;
    }

    let e = this.#events[event];
    if (!e) {
      return;
    }

    e.add(action);
  }

  ignoreEvent(event, action) {
    if (!event || !action) {
      return;
    }

    let e = this.#events[event];
    if (!e) {
      return;
    }

    e.remove(action);
  }

}

class EventDispatcher {
  #listeners = new List();
  #parent;
  
  constructor(parent) {
    this.#parent = parent;
  }

  add(action) {
    if (this.#listeners.includes(action)) {
      return;
    }

    this.#listeners.push(action);
  }

  remove(action) {
    this.#listeners.delete(action);
  }

  dispatch() {
    for (let i = 0; i < this.#listeners.length; i++) {
      let action = this.#listeners[i];
      if (action) {
        action.apply(this.#parent, arguments);
      }
    }
  }
}
