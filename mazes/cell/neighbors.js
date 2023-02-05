
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Neighbors extends EventHandler {
  
  items = new List();
  cell;
  
  constructor(cell) {
    super();
    
    this.cell = cell;
  }
  
  empty() {
    return this.items.length === 0;
  }
  
  any() {
    return this.items.length > 0;
  }
  
  unlinked() {
    let result = new List();
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i].links.empty()) {
        result.push(this.items[i]);
      }
    }
    return result;
  }
  
  linked() {
    let result = new List();
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i].links.any()) {
        result.push(this.items[i]);
      }
    }
    return result;
  }
}
