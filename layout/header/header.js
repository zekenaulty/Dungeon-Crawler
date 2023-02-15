import { EventHandler } from '../../core/eventHandler.js';

export class Header extends EventHandler {

  #header;
  #left;
  #menu;
  #styles;
  
  #gameLevel;

  constructor(gameLevel) {

    super();
    let vm = this;
    
    vm.#gameLevel = gameLevel;

    vm.#header = document.createElement('nav');
    vm.#left = document.createElement('div');
    
    vm.#left.addEventListener('dblclick', () => {
      vm.#gameLevel.solve();
    });
    vm.#menu = document.createElement('div');
    vm.#styles = document.createElement('link');

    vm.#styles.rel = 'stylesheet';
    vm.#styles.href = './layout/header/header.css';

    document.querySelector('head').appendChild(vm.#styles);

    vm.#header.classList.add('head');
    vm.#left.classList.add('header-info');
    vm.#menu.classList.add('header-menu');

    vm.#header.appendChild(vm.#left);

    document.querySelector('body').appendChild(vm.#header);
    document.querySelector('body').appendChild(vm.#menu);

  }

  info(html) {
    let vm = this;
    vm.#left.innerHTML = html;
  }

  addButton(txt, action) {
    let vm = this;
    let btn = document.createElement('button');
    btn.innerText = txt;
    btn.classList.add('header-button');
    btn.addEventListener('click', () => {
      action(btn);
    });
    vm.#menu.appendChild(btn);

    return btn;
  }

  activate(btn) {
    btn.classList.remove('header-button-active');
  }

  deactivate(btn) {
    btn.classList.remove('header-button-active');
  }
}
