import { EventHandler } from '../../core/eventHandler.js';

export class Generator extends EventHandler {

  maze;
  name = '';
  summary = ``;

  constructor(maze) {
    super();
    let vm = this;
    
    vm.defineEvent('generated');
    vm.maze = maze;
  }

  generate() {
    let vm = this;
    vm.raiseEvent('generated');
  }

}


/*****   template   ***********************************

import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class Template extends Generator {

  generate() {
    vm.maze.initialize();
    
    
    
    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}

****************/
