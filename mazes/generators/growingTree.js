
import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class GrowingTree extends Generator {
  
  static sample(list) {
    return list.sample();
  }
  
  static first(list) {
    return list[0];
  }
  
  static last(list) {
    return list[list.length - 1];
  }
  
  static median(list) {
    return list[Math.floor(list.length/2)];
  }
  
  static #filters = [
    GrowingTree.sample,
    GrowingTree.first,
    GrowingTree.last,
    GrowingTree.median,
    GrowingTree.PRB
    ];
    
  static random(list) {
    let filters = GrowingTree.#filters;
    let idx = Math.floor(Math.random() * filters.length);
    return filters[idx](list);
  }
  
  static PRB(list) {
    return Math.floor(Math.random() * 2) === 0 ? list.sample() : list[list.length - 1];
  }

  generate(filter = GrowingTree.last) {
    let vm = this;
    vm.maze.initialize();
    
    let startAt = vm.maze.randomCell();
    let active = new List();
    active.push(startAt);
    
    while(active.any()) {
      let cell = filter(active);
      let availableNeighbors = cell.neighbors.unlinked();
      if(availableNeighbors.any()) {
        let neighbor = availableNeighbors.sample();
        cell.links.connect(neighbor, true, true);
        active.push(neighbor);
      } else {
        active.delete(cell);
      }
    }
    
    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}

