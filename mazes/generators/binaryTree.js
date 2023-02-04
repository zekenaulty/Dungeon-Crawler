import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class BinaryTree extends Generator {

  generate() {
    this.maze.init();
    
    this.maze.walkGrid((r, c) => {
      let cell = this.maze.cell(r, c);
      let choice = new List();

      if (cell.north) {
        choice.push(cell.north);
      }

      if (cell.east) {
        choice.push(cell.east);
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
