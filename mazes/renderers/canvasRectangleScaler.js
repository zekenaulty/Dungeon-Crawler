import { EventHandler } from '../../core/eventHandler.js';

export class CanvasRectangleScaler extends EventHandler {

  #maxCells = 5000;
  #size = 24;
  stageWidth = 300;
  stageHeight = 300;

  rows;
  columns;
  width;
  height;
  offsetX;
  offsetY;
  cells;
  size;

  constructor(width, height, rooms = 3000, toTiny = 14) {
    super();
    
    this.stageWidth = width;
    this.stageHeight = height;
    this.#maxCells = rooms;
    this.#size = toTiny;
    this.calc();
  }

  setScaleBounds(maxCells, minSize) {
    this.#maxCells = maxCells;
    this.#size = minSize;
  }

  calc() {
    let scale = this.#scale();
    this.columns = Math.floor(this.stageWidth / scale);
    this.width = this.columns * scale;
    this.rows = Math.floor(this.stageHeight / scale);
    this.height = this.rows * scale;
    this.cells = this.rows * this.columns;
    this.offsetX = Math.floor((this.stageWidth - this.width) / 4);
    this.offsetY = Math.floor((this.stageHeight - this.height) / 4);
    this.size = scale;
  }

  #scale() {
    let n = this.#maxCells;
    let w = this.stageWidth;
    let h = this.stageHeight;
    let sw, sh;

    let pw = Math.ceil(Math.sqrt(n * w / h));
    if (Math.floor(pw * h / w) * pw < n) {
      sw = h / Math.ceil(pw * h / w);
    } else {
      sw = w / pw;
    }

    let ph = Math.ceil(Math.sqrt(n * h / w));
    if (Math.floor(ph * w / h) * ph < n) {
      sh = w / Math.ceil(w * ph / h);
    } else {
      sh = h / ph;
    }

    let v = Math.floor(Math.max(sw, sh));
    if (v < this.#size) {
      v = this.#size;
    }

    return v;
  }

  y(r) {
    return r * this.size + this.offsetY;
  }

  x(c) {
    return c * this.size + this.offsetX;
  }
}
