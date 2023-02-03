export class Stage {

  #styles;
  #stage;
  #pre;
  #canvas;
  #toggle;
  #gfx;

  constructor(ready) {

    if (ready) {
      this.onReady = ready;
    }

    this.#styles = document.createElement('link');

    this.#styles.rel = 'stylesheet';
    this.#styles.href = './layout/stage/stage.css';

    document.querySelector('head').appendChild(this.#styles);

    this.#stage = document.createElement('div');
    this.#stage.classList.add('stage');

    document.querySelector('body').appendChild(this.#stage);

    this.#canvas = document.createElement('canvas');
    this.#canvas.classList.add('viewport');
    this.#stage.appendChild(this.#canvas);

    this.#pre = document.createElement('pre');
    this.#pre.classList.add('viewport-text');
    this.#pre.classList.add('stage-hide');
    this.#stage.appendChild(this.#pre);

    this.#toggle = document.createElement('button');
    this.#toggle.classList.add('stage-toggle');
    this.#toggle.innerHTML = '》';
    this.#toggle.addEventListener('click', () => {
      this.#toggleView();
    });

    this.#stage.appendChild(this.#toggle);

    this.#gfx = this.#canvas.getContext("2d");

    this.#scale();

  }

  get gfx() {
    return this.#gfx;
  }

  get width() {
    return this.#canvas.width;
  }

  get height() {
    return this.#canvas.height;
  }

  #scale() {
    this.#canvas.width = this.#stage.offsetWidth;
    this.#canvas.height = this.#stage.offsetHeight;
    if (this.#canvas.height > 400) {
      this.onReady(this.#gfx);
    } else {
      setTimeout(() => { this.#scale(); }, 10);
    }
  }

  onReady(gfx) {}

  setTextView(text) {
    this.#pre.innerHTML = text;
  }

  #toggleView() {
    if (this.#toggle.innerHTML === '》') {
      this.#toggle.innerHTML = '《';
      this.#canvas.classList.add('stage-hide');
      this.#pre.classList.remove('stage-hide');
    } else {
      this.#toggle.innerHTML = '》';
      this.#pre.classList.add('stage-hide');
      this.#canvas.classList.remove('stage-hide');
    }
  }

}
