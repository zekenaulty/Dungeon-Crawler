
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

export class Neighbors extends EventHandler {
  
  items = new List();
  cell;
  
  constructor(cell) {
    super();
    
    this.cell = cell;
  }
  
}
