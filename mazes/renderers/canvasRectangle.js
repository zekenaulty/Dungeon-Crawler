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
  solveColor = 'teal';

  showSolution = false;
  showHistogram = false;

  constructor(game, maze, scaler, gfx) {
    super();
    let vm = this;

    vm.defineEvent('rendered');
    vm.#maze = maze;
    vm.#scaler = scaler;
    vm.#gfx = gfx;

    maze.listenToEvent('moved', (dir, from, to, $maze) => {
      vm.drawMove(from, $maze);
    });
    
    game.listenToEvent('teleported', (from, to, $maze) => {
      vm.drawMove(from, $maze);
    });
  }
  
  drawMove(from, $maze){
    let vm = this;
    vm.eraseFloor(from.row, from.column);
    vm.drawSolutionFloor(from.row, from.column);
    
    if (from === $maze.start) {
      vm.drawStart();
    }
    
    if (from === $maze.end) {
      vm.drawEnd();
    }
    
    vm.drawActive();
  }

  scaleLock(n, min = 0) {
    let vm = this;
    if (vm.#scaler.size > 22) {
      return n;
    }
    return min;
  }

  #drawCircle(cell, color, offsetFactor = 0.75, fill = true) {
    let vm = this;
    if (offsetFactor >= 1) {
      offsetFactor = 0.9;
    }

    let x = vm.#scaler.x(cell.column);
    let y = vm.#scaler.y(cell.row);
    let r = Math.floor(vm.#scaler.size / 2);
    let offset = Math.floor(r - (r * offsetFactor));

    if (fill) {
      vm.#gfx.fillStyle = color;
    } else {
      vm.#gfx.strokeStyle = color;
    }

    vm.#gfx.beginPath();
    vm.#gfx.ellipse(
      x + r,
      y + r,
      r - vm.scaleLock(offset, 1.5),
      r - vm.scaleLock(offset, 1.5),
      0,
      0,
      360);
    if (fill) {
      vm.#gfx.fill();
    } else {
      vm.#gfx.stroke();
    }
    vm.#gfx.closePath();
  }

  #drawRectangle(cell, color, offsetFactor = 0.75) {
    let vm = this;
    let offset = Math.floor(vm.#scaler.size - (vm.#scaler.size * offsetFactor));
    new Rectangle(
        vm.#scaler.x(cell.column) + vm.scaleLock(offset, 1.5),
        vm.#scaler.y(cell.row) + vm.scaleLock(offset, 1.5),
        vm.#scaler.size - vm.scaleLock(offset * 2, 3),
        vm.#scaler.size - vm.scaleLock(offset * 2, 3),
        color,
        vm.#gfx)
      .fill();
  }

  #drawNorthEdge(r, c, color) {
    let vm = this;
    let x = vm.#scaler.x(c);
    let y = vm.#scaler.y(r);
    let scale = vm.#scaler.size;

    new Line(
        x,
        y,
        x + scale,
        y,
        vm.#gfx)
      .draw(color);
  }

  #drawEastEdge(r, c, color) {
    let vm = this;
    let x = vm.#scaler.x(c);
    let y = vm.#scaler.y(r);
    let scale = vm.#scaler.size;

    new Line(
        x + scale,
        y, x + scale,
        y + scale,
        vm.#gfx)
      .draw(color);
  }

  #drawSouthEdge(r, c, color) {
    let vm = this;
    let x = vm.#scaler.x(c);
    let y = vm.#scaler.y(r);
    let scale = vm.#scaler.size;

    new Line(
        x,
        y + scale,
        x + scale,
        y + scale,
        vm.#gfx)
      .draw(color);
  }

  #drawWestEdge(r, c, color) {
    let vm = this;
    let x = vm.#scaler.x(c);
    let y = vm.#scaler.y(r);
    let scale = vm.#scaler.size;

    new Line(
        x,
        y,
        x,
        y + scale,
        vm.#gfx)
      .draw(vm.wallColor);
  }

  fillBg() {
    let vm = this;
    new Rectangle(
        0,
        0,
        vm.#scaler.stageWidth,
        vm.#scaler.stageHeight,
        vm.#gfx)
      .fill(vm.bgColor);
  }

  normalize(value, min, max) {
    let normalized = (value - min) / (max - min);
    return normalized;
  }

  draw() {
    let vm = this;
    vm.fillBg();

    vm.#maze.walkGrid((r, c) => {
      vm.drawFloor(r, c);
    });

    vm.drawSolution();
    vm.drawStart();
    vm.drawEnd();
    vm.drawActive();

    vm.#maze.walkGrid((r, c) => {
      vm.drawWalls(r, c);
    });

    vm.drawBorder();

    vm.raiseEvent('rendered');
  }

  drawBorder() {
    let vm = this;
    new Rectangle(
        vm.#scaler.x(0),
        vm.#scaler.y(0),
        vm.#scaler.width,
        vm.#scaler.height,
        vm.#gfx)
      .stroke(vm.wallColor);
  }

  revealSolution() {
    let vm = this;
    vm.showSolution = true;
    vm.#maze.solve();
    vm.drawSolution();
    vm.drawStart();
    vm.drawEnd();
    vm.drawActive();
  }


  hideSolution() {
    let vm = this;
    vm.drawSolution(vm.floorColor, false);
    vm.drawStart();
    vm.drawEnd();
    vm.drawActive();
    vm.showSolution = false;
  }

  drawSolution(color, show = true) {
    let vm = this;
    if (!vm.showSolution || !vm.#maze.solution) {
      return;
    }

    if (!color) {
      color = vm.solveColor;
    }

    for (let i = 0; i < vm.#maze.solution.items.length; i++) {
      if (show) {
        vm.drawSolutionFloor(
          vm.#maze.solution.items[i].row,
          vm.#maze.solution.items[i].column,
          color);
      } else {
        vm.eraseFloor(
          vm.#maze.solution.items[i].row,
          vm.#maze.solution.items[i].column);
      }
    }
  }

  drawSolutionFloor(r, c, color) {
    let vm = this;
    if (!vm.showSolution || !vm.#maze.solution || !vm.#maze.solution.items.includes(vm.#maze.cell(r, c))) {
      return;
    }

    if (!color) {
      color = vm.solveColor;
    }
    let cell = vm.#maze.cell(r, c);
    vm.#drawCircle(cell, color, 0.3);
  }

  eraseFloor(r, c) {
    let vm = this;
    let color = vm.floorColor;
    let floor = new Rectangle(
      vm.#scaler.x(c) + 1,
      vm.#scaler.y(r) + 1,
      vm.#scaler.size - 2,
      vm.#scaler.size - 2,
      vm.#gfx);
    if (vm.showHistogram) {
      let cell = vm.#maze.cell(r, c);
      let a = vm.normalize(
        vm.#maze.distances.distance(cell),
        vm.#maze.distances.distance(vm.#maze.end),
        0
      );
      color = vm.histogramColor(a);
      floor.fill(vm.floorColor);
    }

    floor.fill(color);
  }


  drawFloorEdges(r, c) {
    let vm = this;
    let cell = vm.#maze.cell(r, c);
    let color = vm.floorColor;
    let draw = (color) => {
      if (!cell) {
        return;
      }
      if (cell.links.linked(cell.north)) {
        vm.#drawNorthEdge(r, c, color);
      }
      if (cell.links.linked(cell.east)) {
        vm.#drawEastEdge(r, c, color);
      }
      if (cell.links.linked(cell.south)) {
        vm.#drawSouthEdge(r, c, color);
      }
      if (cell.links.linked(cell.west)) {
        vm.#drawWestEdge(r, c, color);
      }
    };
    if (vm.showHistogram) {
      let a = vm.normalize(
        vm.#maze.distances.distance(cell),
        vm.#maze.distances.distance(vm.#maze.end),
        0
      );
      color = vm.histogramColor(a);
      draw(vm.floorColor);
    }
    draw(color);
  }

  drawFloor(r, c) {
    let vm = this;
    let color = vm.floorColor;
    let floor = new Rectangle(
      vm.#scaler.x(c),
      vm.#scaler.y(r),
      vm.#scaler.size,
      vm.#scaler.size,
      vm.#gfx);
    if (vm.showHistogram) {
      let cell = vm.#maze.cell(r, c);
      let a = vm.normalize(
        vm.#maze.distances.distance(cell),
        vm.#maze.distances.distance(vm.#maze.end),
        0
      );
      color = vm.histogramColor(a);
      floor.fill(vm.floorColor);
    }
    floor.fill(color);
  }

  drawWalls(r, c) {
    let vm = this;
    let cell = vm.#maze.cell(r, c);
    if (!cell) {
      return;
    }
    if (!cell.links.linked(cell.north)) {
      vm.#drawNorthEdge(r, c, vm.wallColor);
    }
    if (!cell.links.linked(cell.east)) {
      vm.#drawEastEdge(r, c, vm.wallColor);
    }
    if (!cell.links.linked(cell.south)) {
      vm.#drawSouthEdge(r, c, vm.wallColor);
    }
    if (!cell.links.linked(cell.west)) {
      vm.#drawWestEdge(r, c, vm.wallColor);
    }
  }

  drawStart() {
    let vm = this;
    if (!vm.#maze.start) {
      vm.#maze.start = vm.#maze.cell(0, 0);
    }
    let cell = vm.#maze.start;
    vm.#drawCircle(cell, vm.startColor);
  }

  drawEnd() {
    let vm = this;
    if (!vm.#maze.end) {
      vm.#maze.end = vm.#maze.cell(vm.#maze.rows - 1, vm.#maze.columns - 1);
    }
    let cell = vm.#maze.end;
    vm.#drawCircle(cell, vm.endColor);
  }

  drawActive() {
    let vm = this;
    if (!vm.#maze.active) {
      vm.#maze.active = vm.#maze.cell(0, 0);
    }
    let cell = vm.#maze.active;
    vm.#drawCircle(cell, vm.activeColor);
  }

  histogram() {
    let vm = this;
    vm.showHistogram = !vm.showHistogram;
    vm.draw();
  }

  histogramColor(a) {
    return `rgba(112,41,99,${a})`;
  }

}
