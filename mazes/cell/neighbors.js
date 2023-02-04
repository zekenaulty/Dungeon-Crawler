
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

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
}
