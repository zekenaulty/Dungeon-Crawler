
import { List } from '../../core/list.js';

export class Links {
  
  items = new List();
  cell;
  
  constructor(cell) {
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
      cell.links.connect(this, link, false);
    }
  }
  
  linked(cell) {
    return this.items.includes(cell);
  }
  
}
