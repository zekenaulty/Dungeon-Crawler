import { EventHandler } from '../../core/eventHandler.js';

export class MazeToText extends EventHandler {
  #maze;
  #output;
  
  constructor(maze) {
    super();
    let vm = this;
    
    vm.#maze = maze;
  }
  
  render(){
    let vm = this;
    vm.#output = '+';
    for(let y = 0; y < vm.#maze.columns; y++) {
      vm.#output += '---+';
    }
    vm.#output += '\r\n';
    
    let top = '';
    let bottom = '';
    let eastBoundry = '';
    let southBoundry = '';
    vm.#maze.walkGrid((r, c) => {
      if(c === 0) {
        top = '|';
        bottom = '+';
      }
      
      let cell = vm.#maze.cell(r, c);
      
      eastBoundry = (cell.links.linked(cell.east)) ? ' ' : '|';
      top += '   ' + eastBoundry;
      
      southBoundry = (cell.links.linked(cell.south)) ? '   ' : '---';
      bottom += southBoundry + '+';
      
      if(c === vm.#maze.columns - 1) {
        vm.#output += top + '\r\n';
        vm.#output += bottom + '\r\n';
      }
    });
  }
  
  get text() {
    let vm = this;
    vm.render();
    return vm.#output;
  }
  
}
