import { EventHandler } from '../../core/eventHandler.js';

export class Stage extends EventHandler {

  #styles;
  #stage;
  #pre;
  #canvas;
  #toggle;
  #gfx;

  constructor(ready) {

    super();
    let vm = this;

    vm.defineEvent('ready');
    if (ready) {
      vm.listenToEvent('ready', ready);
    }

    vm.#styles = document.createElement('link');

    vm.#styles.rel = 'stylesheet';
    vm.#styles.href = './layout/stage/stage.css';

    document.querySelector('head').appendChild(vm.#styles);

    vm.#stage = document.createElement('div');
    vm.#stage.classList.add('stage');

    document.querySelector('body').appendChild(vm.#stage);

    vm.#canvas = document.createElement('canvas');
    vm.#canvas.classList.add('viewport');
    vm.#stage.appendChild(vm.#canvas);

    vm.#gfx = vm.#canvas.getContext("2d");
    
    //vm.#gfx.ellipse()

    vm.#scale();

  }

  get gfx() {
    let vm = this;
    return vm.#gfx;
  }

  get width() {
    let vm = this;
    return vm.#canvas.width;
  }

  get height() {
    let vm = this;
    return vm.#canvas.height;
  }

  #scale() {
    let vm = this;
    vm.#canvas.width = vm.#stage.offsetWidth;
    vm.#canvas.height = vm.#stage.offsetHeight;
    if (vm.#canvas.height > 400) {
      vm.raiseEvent('ready', vm.#gfx);
    } else {
      setTimeout(() => { vm.#scale(); }, 10);
    }
  }

  setTextView(text) {
    let vm = this;
    vm.#pre.innerHTML = text;
  }

}
