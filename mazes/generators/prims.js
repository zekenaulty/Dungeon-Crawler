
import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class SimplePrims extends Generator {

  generate() {
    this.maze.initialize();
    
    let startAt = this.maze.randomCell();
    let active = new List();
    active.push(startAt);
    
    while(active.any()) {
      let cell = active.sample();
      let availableNeighbors = cell.neighbors.unlinked();
      if(availableNeighbors.any()) {
        let neighbor = availableNeighbors.sample();
        cell.links.connect(neighbor, true, true);
        active.push(neighbor);
      } else {
        active.delete(cell);
      }
    }
    
    this.maze.setup();
    
    this.raiseEvent('generated');

  }

}

