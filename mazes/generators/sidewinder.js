import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Sidewinder extends Generator {

  generate() {
    let vm = this;
    vm.maze.initialize();

    let run;
    vm.maze.walkGrid((r, c) => {
      if (c === 0) {
        run = new List();
      }

      let cell = vm.maze.cell(r, c);
      let north = vm.maze.cell(cell.row - 1, cell.column);
      let east = vm.maze.cell(cell.row, cell.column + 1)

      run.push(cell);

      let zeroOut = Math.floor(Math.random() * 2) === 0;
      let closeRun = !east || (north && zeroOut);
      if (closeRun) {
        let n = run.sample();
        north = vm.maze.cell(n.row - 1, n.column);
        n.links.connect(north, true, true);
        run = new List();
      } else {
        cell.links.connect(east, true, true);
      }

    });

    vm.maze.setup();

    vm.raiseEvent('generated');

  }

}
