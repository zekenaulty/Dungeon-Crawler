
import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class HuntAndKill extends Generator {

  generate() {
    let vm = this;
    vm.maze.initialize();
    
    let current = vm.maze.randomCell();
    
    while(current) {
      let unvisitedNeighbors = current.neighbors.unlinked();
      if(unvisitedNeighbors.any()) {
        let neighbor = unvisitedNeighbors.sample();
        current.links.connect(neighbor, true, true);
        current = neighbor;
      } else {
        current = undefined;
        for(let i = 0; i < vm.maze.cells.length; i++) {
          let cell = vm.maze.cells[i];
          let visitedNeighbors = cell.neighbors.linked();
          if(cell.links.empty() && visitedNeighbors.any()) {
            current = cell;
            let neighbor = visitedNeighbors.sample();
            current.links.connect(neighbor, true, true);
            break;
          }
        }
      }
    }
    
    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}
