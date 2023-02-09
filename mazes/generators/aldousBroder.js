import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class AldousBroder extends Generator {

  generate() {
    let vm = this;
    vm.maze.initialize();
    
    let cell = vm.maze.randomCell();
    let unvisited = vm.maze.cells.length - 1;
    
    while(unvisited > 0) {
      let neighbor = cell.neighbors.items.sample();
      if(neighbor.links.empty()) {
        cell.links.connect(neighbor, true, true);
        unvisited--;
      }
      cell = neighbor;
    }
    
    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}
