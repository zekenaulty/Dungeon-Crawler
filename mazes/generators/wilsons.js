import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Wilsons extends Generator {

  generate() {
    this.maze.initialize();
    let first = this.maze.cells.sample();
    let unvisited = new List();

    this.maze.eachCell((c) => {
      if (c !== first) {
        unvisited.push(c);
      }
    });

    while (unvisited.any()) {
      let cell = unvisited.sample();
      let path = new List();

      path.push(cell);
      while (unvisited.includes(cell)) {
        cell = cell.neighbors.items.sample();
        let index = path.indexOf(cell);
        if (index >= 0) {
          path.length = index + 1;
        } else {
          path.push(cell);
        }
      }

      for (let i = 0; i < path.length - 1; i++) {
        path[i].links.connect(path[i + 1], true, true);
        unvisited.delete(path[i]);
      }
    }

    this.maze.setup();

    this.raiseEvent('generated');

  }

}
