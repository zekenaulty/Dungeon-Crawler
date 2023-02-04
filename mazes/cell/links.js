
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

export class Links extends EventHandler {
  
  items = new List();
  cell;
  
  constructor(cell) {
    super();
    
    this.cell = cell;
  }
  
  connect(cell, link = true, both = true) {
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
  }
  
  linked(cell) {
    if(cell === undefined) {
      return false;
    }
    return this.items.includes(cell);
  }
  
  get north() {
    return this.linked(this.cell.north);
  }
  
  get east() {
    return this.linked(this.cell.east);
  }
  
  get south() {
    return this.linked(this.cell.south);
  }
  
  get west() {
    return this.linked(this.cell.west);
  }
  
}
