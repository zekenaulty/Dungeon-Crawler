import { EventHandler } from '../../core/eventHandler.js';

export class Header extends EventHandler {

  #header;
  #left;
  #menuButton;
  #menu;
  #styles;

  constructor() {

    super();
    let vm = this;

    vm.#header = document.createElement('nav');
    vm.#left = document.createElement('div');
    vm.#menu = document.createElement('div');
    vm.#menuButton = document.createElement('button');
    vm.#styles = document.createElement('link');

    vm.#styles.rel = 'stylesheet';
    vm.#styles.href = './layout/header/header.css';

    document.querySelector('head').appendChild(vm.#styles);

    vm.#header.classList.add('head');
    vm.#left.classList.add('header-info');

    vm.#menuButton.classList.add('header-button');
    vm.#menuButton.classList.add('header-menu-btn');
    vm.#menuButton.innerHTML = 'MENU';
    vm.#menuButton.addEventListener('click', () => {
      if (vm.#menu.classList.contains('header-hide')) {
        vm.#menu.classList.remove('header-hide');
      } else {
        vm.#menu.classList.add('header-hide');
      }
    });
    vm.#menu.classList.add('header-menu');
    vm.#menu.classList.add('header-hide');

    vm.#header.appendChild(vm.#left);
    
    document.querySelector('body').appendChild(vm.#header);
    document.querySelector('body').appendChild(vm.#menuButton);
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
      vm.#menu.classList.add('header-hide');
      action();
    });
    vm.#menu.appendChild(btn);
  }
}
