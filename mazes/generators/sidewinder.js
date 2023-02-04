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
      run.push(cell);

      let zeroOut = Math.floor(Math.random() * 2) === 0;
      let closeRun = !cell.east || (cell.north && zeroOut);
      if (closeRun) {
        let n = run.sample();
        n.links.connect(n.north, true, true);
        run = new List();
      } else {
        cell.links.connect(cell.east, true, true);
      }

    });

    this.maze.setup();

    this.raiseEvent('generated');

  }

}