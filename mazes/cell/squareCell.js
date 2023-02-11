
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
  
  directionOf(cell) {
    let vm = this;
    if (vm.north && vm.north.key === cell.key) {
      return 'north';
    }
    
    if (vm.east && vm.east.key === cell.key) {
      return 'east';
    }
    
    if (vm.south && vm.south.key === cell.key) {
      return 'south';
    }
    
    if(vm.west && vm.west.key === cell.key) {
      return 'west';
    }
  }
  
}
