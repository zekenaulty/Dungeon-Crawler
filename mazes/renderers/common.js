export class Line {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  #gfx = undefined;

  constructor(x1, y1, x2, y2, gfx) {
    let vm = this;
    vm.x1 = x1;
    vm.y1 = y1;
    vm.x2 = x2;
    vm.y2 = y2;
    vm.#gfx = gfx;
  }

  draw(style) {
    let vm = this;
    let exec = () => {
      vm.#gfx.beginPath();
      vm.#gfx.moveTo(vm.x1, vm.y1);
      vm.#gfx.lineTo(vm.x2, vm.y2);
      vm.#gfx.strokeStyle = style;
      vm.#gfx.stroke();
      vm.#gfx.closePath();
    };

    exec();
  }
}

export class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  #gfx = undefined;


  constructor(x, y, width, height, gfx) {
    let vm = this;
    vm.x = x;
    vm.y = y;
    vm.width = width;
    vm.height = height;
    vm.#gfx = gfx;
  }

  fill(style) {
    let vm = this;
    vm.#gfx.fillStyle = style;
    vm.#gfx.beginPath();
    vm.#gfx.rect(
      vm.x,
      vm.y,
      vm.width,
      vm.height);
    vm.#gfx.fill();
    vm.#gfx.closePath();
  }
  
  stroke(style) {
    let vm = this;
    vm.#gfx.strokeStyle = style;
    vm.#gfx.beginPath();
    vm.#gfx.rect(
      vm.x,
      vm.y,
      vm.width,
      vm.height);
    vm.#gfx.stroke();
    vm.#gfx.closePath();
  }
}
