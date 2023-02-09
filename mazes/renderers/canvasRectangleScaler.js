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
    let vm = this;
    
    vm.stageWidth = width;
    vm.stageHeight = height;
    vm.#maxCells = rooms;
    vm.#size = toTiny;
    vm.calc();
  }

  setScaleBounds(maxCells, minSize) {
    let vm = this;
    vm.#maxCells = maxCells;
    vm.#size = minSize;
  }

  calc() {
    let vm = this;
    let scale = vm.#scale();
    vm.columns = Math.floor(vm.stageWidth / scale);
    vm.width = vm.columns * scale;
    vm.rows = Math.floor(vm.stageHeight / scale);
    vm.height = vm.rows * scale;
    vm.cells = vm.rows * vm.columns;
    vm.offsetX = Math.floor((vm.stageWidth - vm.width) / 4);
    vm.offsetY = Math.floor((vm.stageHeight - vm.height) / 4);
    vm.size = scale;
  }

  #scale() {
    let vm = this;
    let n = vm.#maxCells;
    let w = vm.stageWidth;
    let h = vm.stageHeight;
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
    if (v < vm.#size) {
      v = vm.#size;
    }

    return v;
  }

  y(r) {
    let vm = this;
    return r * vm.size + vm.offsetY;
  }

  x(c) {
    let vm = this;
    return c * vm.size + vm.offsetX;
  }
}
