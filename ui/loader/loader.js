import { DOM } from '../../core/dom.js';

export class Loader {

  static #loaderBg;
  static #loaderText;
  static #text;
  static #open = false;

  static get isOpen() {
    return Loader.#open;
  }

  static #build() {
    let vm = Loader;
    let bg = vm.#loaderBg;
    let text = vm.#loaderText;

    DOM.stylesheet('./ui/loader/loader.css', 'loader_styles');

    if (!bg) {
      bg = DOM.div(DOM.body, ['loader', 'loader-hide']);
      DOM.div(bg, 'inner-loader');
      vm.#loaderBg = bg;
    }

    if (!text) {
      text = DOM.div(DOM.body, ['loader-over', 'loader-hide']);
      vm.#text = DOM.div(text, 'inner-msg');
      vm.#loaderText = text;
    }
  }

  static open(msg = 'LOADING') {
    let vm = Loader;

    if (vm.#open) {
      vm.#text.innerText = msg;
      return;
    }

    vm.#build();
    vm.#open = true;

    vm.#text.innerText = msg;

    vm.#loaderText.classList.remove('loader-hide');
    vm.#loaderBg.classList.remove('loader-hide');
  }

  static close(delay = 0) {
    let vm = Loader;

    if (!vm.#open) {
      return;
    }

    setTimeout(() => {
      vm.#loaderBg.classList.add('loader-hide');
      vm.#loaderText.classList.add('loader-hide');
      vm.#open = false;
    }, delay);

  }

}