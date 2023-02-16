import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Stage extends EventHandler {

  #styles;
  #stage;
  #canvas;
  #gfx;

  constructor(ready) {

    super();
    let vm = this;

    vm.defineEvent('ready');
    if (ready) {
      vm.listenToEvent('ready', ready);
    }

    DOM.stylesheet('./ui/stage/stage.css', 'stage_styles')

    vm.#stage = DOM.div(DOM.body, 'stage');
    vm.#canvas = DOM.canvas(vm.#stage, 'viewport');
    vm.#gfx = vm.#canvas.getContext("2d");
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

}
