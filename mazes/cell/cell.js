
import { List } from '../../core/list.js';
import { Links } from './links.js';
import { Neighbors } from './neighbors.js';
import { Distance } from '../distance.js';
import { EventHandler } from '../../core/eventHandler.js'


export class Cell extends EventHandler {
  
  links = new Links(this);
  neighbors = new Neighbors(this);
  row = 0;
  column = 0;
  north;
  south;
  east;
  west;
  
  constructor(row, column) {
    super();
    
    this.row = row;
    this.column = column;
  }
  
  get key() {
    return this.row + ',' + this.column;
  }
  
  distances() {
    let result = new Distance(this);
    let frontier = new List();
    frontier.push(this);

    while (true) {
      let newFrontier = new List();

      for (let i = 0; i < frontier.length; i++) {
        let cell = frontier[i];
        for (let j = 0; j < cell.links.items.length; j++) {
          let linked = cell.links.items[j];
          let d = result.distance(cell) + 1;
          if (result.items.includes(linked)) {
            continue;
          }
          result.collect(linked, d);
          newFrontier.push(linked);
        }
      }

      if (newFrontier.length < 1) {
        break;
      }

      frontier = newFrontier;
    }

    return result;
  }
  
}
