import { List } from '../core/list.js';
import { Cell } from './cell/cell.js';

export class Maze {

  grid = new List();
  cells = new List();
  rows = 0;
  columns = 0;

  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    console.info(`rows: ${rows}, columns: ${columns}`);

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

}