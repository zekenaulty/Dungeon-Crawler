import { EventHandler } from '../../core/eventHandler.js';

export class Generator extends EventHandler {

  maze;
  name = '';
  summary = ``;

  constructor(maze) {
    super();
    
    this.defineEvent('generated');
    this.maze = maze;
  }

  generate() {
    this.raiseEvent('generated');
  }

}


/*****   template   ***********************************

import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Template extends Generator {

  generate() {
    this.maze.initialize();
    
    
    
    this.maze.setup();
    
    this.raiseEvent('generated');

  }

}

****************/
