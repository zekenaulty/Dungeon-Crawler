import { Line, Rectangle } from './common.js';

export class CanvasRectangle {

  #maze;
  #scaler;
  #gfx;

  bgColor = 'black';
  wallColor = 'orange';
  floorColor = 'black';
  startColor = 'cornflowerblue';
  endColor = '#D2042D';
  pathColor = '#7F00FF';
  activeColor = '#800080';
  solveColor = 'indigo';
  
  showSolution = false;

  constructor(maze, scaler, gfx) {
    this.#maze = maze;
    this.#scaler = scaler;
    this.#gfx = gfx;
  }

  draw() {
    let bg = new Rectangle(0, 0, this.#scaler.width, this.#scaler.height, this.bgColor, this.#gfx);
    bg.draw();

    this.#maze.walkGrid((r, c) => {
      this.drawFloor(r, c);
    });

    this.#maze.walkGrid((r, c) => {
      this.drawWalls(r, c);
    });
    
    this.drawSolution();
    
    this.drawStart();
    this.drawEnd();
    this.drawActive();

    this.onRendered();

  }
  
  drawSolution() {
    if(!this.showSolution || !this.#maze.solution ) {
      return;
    }
    
    for(let i = 0; i < this.#maze.solution.items.length; i++) {
      let cell = this.#maze.solution.items[i];
      let dot = new Rectangle(
        this.#scaler.x(cell.column) + 8,
        this.#scaler.y(cell.row) + 8,
        this.#scaler.size - 16,
        this.#scaler.size - 16,
        this.solveColor,
        this.#gfx);
      dot.draw();
    }
  }

  drawFloor(r, c) {
    let floor = new Rectangle(this.#scaler.x(c), this.#scaler.y(r), this.#scaler.size, this.#scaler.size, this.floorColor, this.#gfx);
    floor.draw();
  }

  drawWalls(r, c) {
    let cell = this.#maze.cell(r, c);
    if (!cell) {
      return;
    }
    let x = this.#scaler.x(c);
    let y = this.#scaler.y(r);
    let scale = this.#scaler.size;
    if (!cell.links.north) {
      let north = new Line(x, y, x + scale, y, this.#gfx);
      north.draw(this.wallColor);
    }
    if (!cell.links.east) {
      let east = new Line(x + scale, y, x + scale, y + scale, this.#gfx);
      east.draw(this.wallColor);
    }
    if (!cell.links.south) {
      let south = new Line(x, y + scale, x + scale, y + scale, this.#gfx);
      south.draw(this.wallColor);
    }
    if (!cell.links.west) {
      let west = new Line(x, y, x, y + scale, this.#gfx);
      west.draw(this.wallColor);
    }
  }
  
  drawStart() {
    if(!this.#maze.start) {
      this.#maze.start = this.#maze.cell(0, 0);
    }
    let cell = this.#maze.start;
    let start = new Rectangle(
      this.#scaler.x(cell.column) + 6, 
      this.#scaler.y(cell.row) + 6, 
      this.#scaler.size - 12, 
      this.#scaler.size - 12, 
      this.startColor, 
      this.#gfx);
    start.draw();
  }
  
  drawEnd() {
    if(!this.#maze.end) {
      this.#maze.end = this.#maze.cell(this.#maze.rows - 1, this.#maze.columns - 1);
    }
    let cell = this.#maze.end;
    let end = new Rectangle(
      this.#scaler.x(cell.column) + 6, 
      this.#scaler.y(cell.row) + 6, 
      this.#scaler.size - 12, 
      this.#scaler.size - 12, 
      this.endColor, 
      this.#gfx);
    end.draw();
  }
  
  drawActive() {
    if(!this.#maze.active) {
      this.#maze.active = this.#maze.cell(0, 0);
    }
    let cell = this.#maze.active;
    let active = new Rectangle(
      this.#scaler.x(cell.column) + 8, 
      this.#scaler.y(cell.row) + 8, 
      this.#scaler.size - 16, 
      this.#scaler.size - 16, 
      this.activeColor, 
      this.#gfx);
    active.draw();
  }

  onRendered() {

  }

}
