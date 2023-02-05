
import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class HuntAndKill extends Generator {

  generate() {
    this.maze.init();
    
    let current = this.maze.randomCell();
    
    while(current) {
      let unvisitedNeighbors = current.neighbors.unlinked();
      if(unvisitedNeighbors.any()) {
        let neighbor = unvisitedNeighbors.sample();
        current.links.connect(neighbor, true, true);
        current = neighbor;
      } else {
        current = undefined;
        for(let i = 0; i < this.maze.cells.length; i++) {
          let cell = this.maze.cells[i];
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
    
    this.maze.setup();
    
    this.raiseEvent('generated');

  }

}
