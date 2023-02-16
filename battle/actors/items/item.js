import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'

export class Item extends EventHandler {

  name = 'base item';
  displayName = 'Item';
  stackable = false;
  equipable = false;
  

  constructor() {
    super();
    let vm = this;

  }
  
  get summary() {
    let vm = this;
    return `Base Item from which all items and equipment are derived.`;
  }
  
  equip() {}
  
  unequip() {}
  
  use() {}
  

}
