import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Header extends EventHandler {

  #header;
  #left
  #menu;

  #gameLevel;

  constructor(gameLevel) {

    super();
    let vm = this;

    vm.#gameLevel = gameLevel;

    DOM.stylesheet('./layout/header/header.css', 'header_styles');

    vm.#header = DOM.nav(DOM.body, 'head');
    vm.#left = DOM.div(vm.#header, 'header-info');
    vm.#menu = DOM.nav(DOM.body, 'header-menu');

    vm.#left.addEventListener('dblclick', () => {
      vm.#gameLevel.solve();
    });

  }

  info(html) {
    let vm = this;
    vm.#left.innerHTML = html;
  }

  addButton(text, action) {
    let vm = this;
    return DOM.button(
      text,
      vm.#menu,
      'header-button',
      action
    );
  }

  activate(btn) {
    btn.classList.remove('header-button-active');
  }

  deactivate(btn) {
    btn.classList.remove('header-button-active');
  }
}
