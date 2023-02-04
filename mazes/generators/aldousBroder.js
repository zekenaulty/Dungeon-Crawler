import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class AldousBroder extends Generator {

  generate() {
    this.maze.init();
    
    let cell = this.maze.randomCell();
    let unvisited = this.maze.cells.length - 1;
    
    while(unvisited > 0) {
      let neighbor = cell.neighbors.items.sample();
      if(neighbor.links.empty()) {
        cell.links.connect(neighbor, true, true);
        unvisited--;
      }
      cell = neighbor;
    }
    
    this.maze.setup();
    
    this.raiseEvent('generated');

  }

}
