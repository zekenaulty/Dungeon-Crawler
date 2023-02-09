import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Wilsons extends Generator {

  generate() {
    let vm = this;
    vm.maze.initialize();
    let first = vm.maze.cells.sample();
    let unvisited = new List();

    vm.maze.eachCell((c) => {
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

    vm.maze.setup();

    vm.raiseEvent('generated');

  }

}
