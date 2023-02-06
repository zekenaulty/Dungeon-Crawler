import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class BinaryTree extends Generator {

  generate() {
    this.maze.initialize();
    
    this.maze.walkGrid((r, c) => {
      let cell = this.maze.cell(r, c);
      let choice = new List();

      let north = this.maze.cell(cell.row - 1, cell.column);
      if (north) {
        choice.push(north);
      }

      let east = this.maze.cell(cell.row, cell.column + 1)
      if (east) {
        choice.push(east);
      }

      if (choice.length > 0) {
        cell.links.connect(
          choice.sample(),
          true,
          true);
      }
    });
    
    this.maze.setup();
    
    this.raiseEvent('generated');

  }

}
