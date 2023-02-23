import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'

export class Item extends EventHandler {

  stackable = false;
  equipable = false;
  

  constructor() {
    super();
    let vm = this;

  }
  
  get name() {
    return 'base item';
  }
  
  get displayName() {
    return 'Item';
  }
  
  get summary() {
    let vm = this;
    return `Base Item from which all items and equipment are derived.`;
  }
  
  equip() {}
  
  unequip() {}
  
  use(target) {
    
  }
  

}
