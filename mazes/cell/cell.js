
import { List } from '../../core/list.js';
import { Links } from './links.js';
import { Neighbors } from './neighbors.js';
import { Distance } from '../distance.js';
import { EventHandler } from '../../core/eventHandler.js';


export class Cell extends EventHandler {
  
  links = new Links(this);
  neighbors = new Neighbors(this);
  row = 0;
  column = 0;
  
  saveState() {
    let vm = this;
    return {
      row: vm.row,
      column: vm.column,
      links: vm.links.saveState(),
      neighbors: vm.neighbors.saveState()
    };
  }
  
  loadState(maze, state) {
    let vm = this;
    vm.links.loadState(maze, state.links);
    vm.neighbors.loadState(maze, state.neighbors);
  }
  
  constructor(row, column) {
    super();
    let vm = this;
    
    vm.row = row;
    vm.column = column;
  }
  
  get key() {
    let vm = this;
    return vm.row + ',' + vm.column;
  }
  
  get gridPosition() {
    let vm = this;
    return {
      row: vm.row,
      column: vm.column
    };
  }
  
  distances() {
    let vm = this;
    let result = new Distance(vm);
    let frontier = new List();
    frontier.push(vm);

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
