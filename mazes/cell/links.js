
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Links extends EventHandler {
  
  items = new List();
  cell;
  
  constructor(cell) {
    super();
    
    this.cell = cell;
  }
  
  connect(cell, link = true, both = true) {
    
    if(!cell) {
      return false;
    }
    
    if(link) {
      if(!this.linked(cell)) {
        this.items.push(cell);
      }
    } else {
      this.items.delete(cell);
    }
    
    if(both) {
      cell.links.connect(this.cell, link, false);
    }
    
    return true;
  }
  
  linked(cell) {
    if(cell === undefined) {
      return false;
    }
    return this.items.includes(cell);
  }
  
  empty() {
    return this.items.length === 0;
  }
  
  any() {
    return this.items.length > 0;
  }
}
