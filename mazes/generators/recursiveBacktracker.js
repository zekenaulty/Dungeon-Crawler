
import { List } from '../../core/list.js';
import { Generator } from './generator.js';

export class RecursiveBacktracker extends Generator {

  generate() {
    let vm = this;
    vm.maze.initialize();
    
    let stack = new List();
    stack.push(vm.maze.randomCell());
    
    while(stack.length > 0) {
      let current = stack[stack.length - 1];
      let neighbors = current.neighbors.unlinked();
      if(neighbors.length === 0) {
        stack.pop();
      } else {
        let neighbor = neighbors.sample();
        current.links.connect(neighbor, true, true);
        stack.push(neighbor);
      }
    }

    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}
