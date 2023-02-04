import { Line, Rectangle } from './common.js';
import { EventHandler } from '../../core/eventHandler.js'

export class CanvasRectangle extends EventHandler {

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
    super();

    this.defineEvent('rendered');
    this.#maze = maze;
    this.#scaler = scaler;
    this.#gfx = gfx;

    let self = this;
    maze.listenToEvent('moved', (dir, from, to, $maze) => {
      self.eraseFloor(from.row, from.column);
      self.drawSolutionFloor(from.row, from.column);
      if (from === $maze.start) {
        self.drawStart();
      }
      if (from === $maze.end) {
        self.drawEnd();
      }
      
      self.drawActive();
    });
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

    this.raiseEvent('rendered');

  }

  drawSolution() {
    if (!this.showSolution || !this.#maze.solution) {
      return;
    }

    for (let i = 0; i < this.#maze.solution.items.length; i++) {
      this.drawSolutionFloor(this.#maze.solution.items[i].row, this.#maze.solution.items[i].column);
    }
  }

  drawSolutionFloor(r, c) {
    if (!this.showSolution || !this.#maze.solution || !this.#maze.solution.includes(this.#maze.cell(r, c))) {
      return;
    }

    let dot = new Rectangle(
      this.#scaler.x(c) + 8,
      this.#scaler.y(r) + 8,
      this.#scaler.size - 16,
      this.#scaler.size - 16,
      this.solveColor,
      this.#gfx);
    dot.draw();
  }

  eraseFloor(r, c) {
    let floor = new Rectangle(this.#scaler.x(c) + 1, this.#scaler.y(r) + 1, this.#scaler.size - 2, this.#scaler.size - 2, this.floorColor, this.#gfx);
    floor.draw();
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
    if (!this.#maze.start) {
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
    if (!this.#maze.end) {
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
    if (!this.#maze.active) {
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

}
