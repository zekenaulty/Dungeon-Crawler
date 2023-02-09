import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'

export class Item extends EventHandler {

  name = 'base item';
  summary = '';

  constructor() {
    super();
    let vm = this;

  }
  
  typeOf() {
    return 'base item';
  }

}
