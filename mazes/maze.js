import { List } from '../core/list.js';
import { Cell } from './cell/cell.js';
import { EventHandler } from '../core/eventHandler.js'

export class Maze extends EventHandler {

  grid = new List();
  cells = new List();
  visited = new List();

  rows = 0;
  columns = 0;
  start;
  end;
  active;
  distances;
  solution;

  constructor(rows, columns) {
    super();
    
    this.rows = rows;
    this.columns = columns;
  }

  init() {

    this.grid = new List();
    this.cells = new List();
    this.visited = new List();

    this.start = undefined;
    this.end = undefined;
    this.active = undefined;
    this.distances = undefined;
    this.solution = undefined;

    let cells = this.#populate();
    this.grid = cells.grid;
    this.cells = cells.all;

    this.#configureCells();
  }

  #populate() {
    let all = new List();
    let grid = new List();

    this.walkGrid((r, c) => {
      if (grid.length - 1 < r) {
        grid.push(new List());
      }
      let n = new Cell(r, c);
      grid[r].push(n);
      all.push(n);
    });

    return {
      grid: grid,
      all: all
    };
  }

  #configureCells() {
    this.eachCell((cell) => {
      cell.north = this.cell(cell.row - 1, cell.column);
      cell.east = this.cell(cell.row, cell.column + 1);
      cell.south = this.cell(cell.row + 1, cell.column);
      cell.west = this.cell(cell.row, cell.column - 1);

      if (cell.north) { cell.neighbors.items.push(cell.north); }
      if (cell.east) { cell.neighbors.items.push(cell.east); }
      if (cell.south) { cell.neighbors.items.push(cell.south); }
      if (cell.west) { cell.neighbors.items.push(cell.west); }
    });
  }

  cell(row, column) {
    if (row < 0 || column < 0 || row >= this.rows || column >= this.columns) {
      return undefined;
    }

    return this.grid[row][column];
  }

  eachRow(action) {
    for (let r = 0; r < this.rows; r++) {
      action(this.grid[r]);
    }
  }

  eachCell(action) {
    for (let i = 0; i < this.cells.length; i++) {
      action(this.cells[i]);
    }
  }

  walkGrid(action) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        action(r, c);
      }
    }
  }

  randomCell() {
    return this.grid.sample().sample();
  }

  get size() {
    return this.rows * this.columns;
  }

  setup() {
    this.deadends = this.findDeadends();
    this.start = this.deadends.sample();
    this.distances = this.start.distances();
    let d = this.distances.max();
    this.start = d.cell;
    this.distances = this.start.distances();
    d = this.distances.max();
    this.end = d.cell;
    this.active = this.start;
    this.visited.push(this.start);
  }

  findDeadends() {
    let r = new List();
    this.eachCell((c) => {
      if (c.links.items.length === 1) {
        r.push(c);
      }
    });
    return r;
  }

  solve() {
    this.solution = this.distances.pathTo(this.end);
  }
}
