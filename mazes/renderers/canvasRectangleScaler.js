import { EventHandler } from '../../core/eventHandler.js';

export class CanvasRectangleScaler extends EventHandler {

  #maxCells = 10000;
  #size = 23;
  #width = 300;
  #height = 300;

  rows;
  columns;
  width;
  height;
  offsetX;
  offsetY;
  cells;
  size;

  constructor(width, height) {
    super();
    
    this.#width = width;
    this.#height = height;
    this.calc();
  }

  setScaleBounds(maxCells, minSize) {
    this.#maxCells = maxCells;
    this.#size = minSize();
  }

  calc() {
    let scale = this.#scale();
    this.columns = Math.floor(this.#width / scale);
    this.width = this.columns * scale;
    this.rows = Math.floor(this.#height / scale);
    this.height = this.rows * scale;
    this.cells = this.rows * this.columns;
    this.offsetX = Math.floor((this.#width - this.width) / 4);
    this.offsetY = Math.floor((this.#height - this.height) / 4);
    this.size = scale;
  }

  #scale() {
    let n = this.#maxCells;
    let w = this.#width;
    let h = this.#height;
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
