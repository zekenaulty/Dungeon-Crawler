export class Line {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  #gfx = undefined;

  constructor(x1, y1, x2, y2, gfx) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.#gfx = gfx;
  }

  draw(style) {
    let exec = () => {
      this.#gfx.beginPath();
      this.#gfx.moveTo(this.x1, this.y1);
      this.#gfx.lineTo(this.x2, this.y2);
      this.#gfx.strokeStyle = style;
      this.#gfx.stroke();
      this.#gfx.closePath();
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
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.#gfx = gfx;
  }

  fill(style) {
    this.#gfx.fillStyle = style;
    this.#gfx.beginPath();
    this.#gfx.rect(
      this.x,
      this.y,
      this.width,
      this.height);
    this.#gfx.fill();
    this.#gfx.closePath();
  }
  
  stroke(style) {
    this.#gfx.strokeStyle = style;
    this.#gfx.beginPath();
    this.#gfx.rect(
      this.x,
      this.y,
      this.width,
      this.height);
    this.#gfx.stroke();
    this.#gfx.closePath();
  }
}
