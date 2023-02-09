
import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Links extends EventHandler {
  
  items = new List();
  cell;
  
  constructor(cell) {
    super();
    let vm = this;
    
    vm.cell = cell;
  }
  
  connect(cell, link = true, both = true) {
    let vm = this;
    
    if(!cell) {
      return false;
    }
    
    if(link) {
      if(!vm.linked(cell)) {
        vm.items.push(cell);
      }
    } else {
      vm.items.delete(cell);
    }
    
    if(both) {
      cell.links.connect(vm.cell, link, false);
    }
    
    return true;
  }
  
  linked(cell) {
    let vm = this;
    if(cell === undefined) {
      return false;
    }
    return vm.items.includes(cell);
  }
  
  empty() {
    let vm = this;
    return vm.items.length === 0;
  }
  
  any() {
    let vm = this;
    return vm.items.length > 0;
  }
}
