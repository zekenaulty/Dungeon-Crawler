
export class Stage {

  #styles;
  #stage;
  #canvas;
  #gfx;

  constructor(ready) {
    
    if(ready) {
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

    this.#gfx = this.#canvas.getContext("2d");

    this.#scale();

  }

  get gfx() {
    return this.#gfx;
  }

  #scale() {
    this.#canvas.width = this.#stage.offsetWidth;
    this.#canvas.height = this.#stage.offsetHeight;
    if (this.#canvas.height > 200) {
      this.onReady(this.#gfx);
    } else {
      setTimeout(() => { this.#scale(); }, 1);
    }
  }
  
  onReady(gfx) {}

}
