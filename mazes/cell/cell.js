
import { List } from '../../core/list.js';
import { Links } from './links.js';
import { Neighbors } from './neighbors.js';


export class Cell {
  
  links = new Links(this);
  neighbors = new Neighbors(this);
  row = 0;
  column = 0;
  north;
  south;
  east;
  west;
  
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
  
  
}
