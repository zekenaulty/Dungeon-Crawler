import { Line, Rectangle } from './common.js';
import { EventHandler } from '../../core/eventHandler.js';

export class CanvasRectangle extends EventHandler {

  #maze;
  #scaler;
  #gfx;

  bgColor = 'black';
  wallColor = 'orange';
  floorColor = 'black';
  startColor = 'cornflowerblue';
  endColor = 'green'; //'#D2042D';
  //pathColor = '#7F00FF';
  activeColor = 'silver'; //'#800080';
  solveColor = 'cornflowerblue';

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

  scaleLock(n, min = 0) {
    if (this.#scaler.size > 22) {
      return n;
    }
    return min;
  }

  #drawCircle(cell, color, offsetFactor = 0.75, fill = true) {
    if (offsetFactor >= 1) {
      offsetFactor = 0.9;
    }

    let x = this.#scaler.x(cell.column);
    let y = this.#scaler.y(cell.row);
    let r = Math.floor(this.#scaler.size / 2);
    let offset = Math.floor(r - (r * offsetFactor));

    if (fill) {
      this.#gfx.fillStyle = color;
    } else {
      this.#gfx.strokeStyle = color;
    }
    
    this.#gfx.beginPath();
    this.#gfx.ellipse(
      x + r,
      y + r,
      r - this.scaleLock(offset, 1.5),
      r - this.scaleLock(offset, 1.5),
      0,
      0,
      360);
    if (fill) {
      this.#gfx.fill();
    } else {
      this.#gfx.stroke();
    }
    this.#gfx.closePath();
  }

  #drawRectangle(cell, color, offsetFactor = 0.75) {
    let offset = Math.floor(this.#scaler.size - (this.#scaler.size * offsetFactor));
    new Rectangle(
        this.#scaler.x(cell.column) + this.scaleLock(offset, 1.5),
        this.#scaler.y(cell.row) + this.scaleLock(offset, 1.5),
        this.#scaler.size - this.scaleLock(offset * 2, 3),
        this.#scaler.size - this.scaleLock(offset * 2, 3),
        color,
        this.#gfx)
      .fill();
  }

  #drawNorthEdge(r, c, color) {
    let x = this.#scaler.x(c);
    let y = this.#scaler.y(r);
    let scale = this.#scaler.size;

    new Line(
        x,
        y,
        x + scale,
        y,
        this.#gfx)
      .draw(color);
  }

  #drawEastEdge(r, c, color) {
    let x = this.#scaler.x(c);
    let y = this.#scaler.y(r);
    let scale = this.#scaler.size;

    new Line(
        x + scale,
        y, x + scale,
        y + scale,
        this.#gfx)
      .draw(color);
  }

  #drawSouthEdge(r, c, color) {
    let x = this.#scaler.x(c);
    let y = this.#scaler.y(r);
    let scale = this.#scaler.size;

    new Line(
        x,
        y + scale,
        x + scale,
        y + scale,
        this.#gfx)
      .draw(color);
  }

  #drawWestEdge(r, c, color) {
    let x = this.#scaler.x(c);
    let y = this.#scaler.y(r);
    let scale = this.#scaler.size;

    new Line(
        x,
        y,
        x,
        y + scale,
        this.#gfx)
      .draw(this.wallColor);
  }

  fillBg() {
    new Rectangle(
        0,
        0,
        this.#scaler.stageWidth,
        this.#scaler.stageHeight,
        this.#gfx)
      .fill(this.bgColor);
  }

  draw() {
    this.fillBg();

    this.#maze.walkGrid((r, c) => {
      this.drawFloor(r, c);
    });

    this.drawSolution();
    this.drawStart();
    this.drawEnd();
    this.drawActive();

    this.#maze.walkGrid((r, c) => {
      this.drawWalls(r, c);
    });

    this.drawBorder();

    this.raiseEvent('rendered');
  }

  drawBorder() {
    new Rectangle(
        this.#scaler.x(0),
        this.#scaler.y(0),
        this.#scaler.width,
        this.#scaler.height,
        this.#gfx)
      .stroke(this.wallColor);
  }

  revealSolution() {
    this.showSolution = true;
    this.#maze.solve();
    this.drawSolution();
    this.drawStart();
    this.drawEnd();
    this.drawActive();
  }


  hideSolution() {
    this.drawSolution(this.floorColor, false);
    this.drawStart();
    this.drawEnd();
    this.drawActive();
    this.showSolution = false;
  }

  drawSolution(color, show = true) {
    if (!this.showSolution || !this.#maze.solution) {
      return;
    }

    if (!color) {
      color = this.solveColor;
    }

    for (let i = 0; i < this.#maze.solution.items.length; i++) {
      if(show) {
      this.drawSolutionFloor(
        this.#maze.solution.items[i].row, 
        this.#maze.solution.items[i].column, 
        color);
      } else {
        this.eraseFloor(
        this.#maze.solution.items[i].row, 
        this.#maze.solution.items[i].column);
      }
    }
  }

  drawSolutionFloor(r, c, color) {
    if (!this.showSolution || !this.#maze.solution || !this.#maze.solution.items.includes(this.#maze.cell(r, c))) {
      return;
    }

    if (!color) {
      color = this.solveColor;
    }
    let cell = this.#maze.cell(r, c);
    this.#drawCircle(cell, color, 0.3);
  }

  eraseFloor(r, c) {
    new Rectangle(
        this.#scaler.x(c) + 1,
        this.#scaler.y(r) + 1,
        this.#scaler.size - 2,
        this.#scaler.size - 2,
        this.#gfx)
      .fill(this.floorColor);
  }


  drawFloorEdges(r, c) {
    let cell = this.#maze.cell(r, c);
    if (!cell) {
      return;
    }
    if (cell.links.linked(cell.north)) {
      this.#drawNorthEdge(r, c, this.floorColor);
    }
    if (cell.links.linked(cell.east)) {
      this.#drawEastEdge(r, c, this.floorColor);
    }
    if (cell.links.linked(cell.south)) {
      this.#drawSouthEdge(r, c, this.floorColor);
    }
    if (cell.links.linked(cell.west)) {
      this.#drawWestEdge(r, c, this.floorColor);
    }
  }

  drawFloor(r, c) {
    new Rectangle(
        this.#scaler.x(c),
        this.#scaler.y(r),
        this.#scaler.size,
        this.#scaler.size,
        this.#gfx)
      .fill(this.floorColor);
  }

  drawWalls(r, c) {
    let cell = this.#maze.cell(r, c);
    if (!cell) {
      return;
    }
    if (!cell.links.linked(cell.north)) {
      this.#drawNorthEdge(r, c, this.wallColor);
    }
    if (!cell.links.linked(cell.east)) {
      this.#drawEastEdge(r, c, this.wallColor);
    }
    if (!cell.links.linked(cell.south)) {
      this.#drawSouthEdge(r, c, this.wallColor);
    }
    if (!cell.links.linked(cell.west)) {
      this.#drawWestEdge(r, c, this.wallColor);
    }
  }

  drawStart() {
    if (!this.#maze.start) {
      this.#maze.start = this.#maze.cell(0, 0);
    }
    let cell = this.#maze.start;
    this.#drawCircle(cell, this.startColor);
  }

  drawEnd() {
    if (!this.#maze.end) {
      this.#maze.end = this.#maze.cell(this.#maze.rows - 1, this.#maze.columns - 1);
    }
    let cell = this.#maze.end;
    this.#drawCircle(cell, this.endColor);
  }

  drawActive() {
    if (!this.#maze.active) {
      this.#maze.active = this.#maze.cell(0, 0);
    }
    let cell = this.#maze.active;
    this.#drawCircle(cell, this.activeColor);
  }

}
