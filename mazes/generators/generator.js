import { EventHandler } from '../../core/eventHandler.js'

export class Generator extends EventHandler {

  maze;

  constructor(maze) {
    super();
    
    this.defineEvent('generated');
    this.maze = maze;
  }

  generate() {
    this.raiseEvent('generated');
  }

}
