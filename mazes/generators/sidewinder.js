import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Sidewinder extends Generator {

  generate() {
    this.maze.init();

    let run;
    this.maze.walkGrid((r, c) => {
      if (c === 0) {
        run = new List();
      }

      let cell = this.maze.cell(r, c);
      let north = this.maze.cell(cell.row - 1, cell.column);
      let east = this.maze.cell(cell.row, cell.column + 1)

      run.push(cell);

      let zeroOut = Math.floor(Math.random() * 2) === 0;
      let closeRun = !east || (north && zeroOut);
      if (closeRun) {
        let n = run.sample();
        north = this.maze.cell(n.row - 1, n.column);
        n.links.connect(north, true, true);
        run = new List();
      } else {
        cell.links.connect(east, true, true);
      }

    });

    this.maze.setup();

    this.raiseEvent('generated');

  }

}