
import { List } from '../../core/list.js';
import { Cell } from './cell.js';

export class SquareCell extends Cell {
  north;
  east;
  south;
  west;
  
  constructor(row, column) {
    super(row, column);
  }
}
