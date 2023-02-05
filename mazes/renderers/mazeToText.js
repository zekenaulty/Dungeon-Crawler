import { EventHandler } from '../../core/eventHandler.js';

export class MazeToText extends EventHandler {
  #maze;
  #output;
  
  constructor(maze) {
    super();
    
    this.#maze = maze;
  }
  
  render(){
    this.#output = '+';
    for(let y = 0; y < this.#maze.columns; y++) {
      this.#output += '---+';
    }
    this.#output += '\r\n';
    
    let top = '';
    let bottom = '';
    let eastBoundry = '';
    let southBoundry = '';
    this.#maze.walkGrid((r, c) => {
      if(c === 0) {
        top = '|';
        bottom = '+';
      }
      
      let cell = this.#maze.cell(r, c);
      
      eastBoundry = (cell.links.east) ? ' ' : '|';
      top += '   ' + eastBoundry;
      
      southBoundry = (cell.links.south) ? '   ' : '---';
      bottom += southBoundry + '+';
      
      if(c === this.#maze.columns - 1) {
        this.#output += top + '\r\n';
        this.#output += bottom + '\r\n';
      }
    });
  }
  
  get text() {
    this.render();
    return this.#output;
  }
  
}
