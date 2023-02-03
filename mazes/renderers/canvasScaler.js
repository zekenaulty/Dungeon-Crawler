export class CanvasScaler {

  #maxCells = 10000;
  #size = 24;
  #width = 300;
  #height = 300;

  rows;
  columns;
  width;
  height;
  offsetX;
  offsetY;
  cells;

  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  setScaleBounds(maxCells, minSize) {
    this.#maxCells = maxCells;
    this.#size = minSize();
  }
  
  calc() {
    let scale = this.#scale();

    let perRow = 1;
    while ((perRow + 1) * scale < this.#width) {
      perRow++;
    }
    this.columns = perRow;
    this.width = this.columns * scale;

    let rowCount = 1;
    while ((rowCount + 1) * scale < this.#height) {
      rowCount++;
    }
    this.rows = rowCount;
    this.height = this.rows * scale;

    this.cells = perRow * rowCount;

    this.offsetX = Math.floor((this.#width - (perRow * scale)) / 2);
    this.offsetY = Math.floor((this.#height - (rowCount * scale)) / 2);

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
      return this.#size;
    }

    return v;
  }
}
