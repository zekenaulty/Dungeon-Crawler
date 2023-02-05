import { EventHandler } from '../../core/eventHandler.js';

export class Header extends EventHandler {

  #header;
  #left;
  #menuButton;
  #menu;
  #styles;

  constructor() {

    super();

    this.#header = document.createElement('nav');
    this.#left = document.createElement('div');
    this.#menu = document.createElement('div');
    this.#menuButton = document.createElement('button');
    this.#styles = document.createElement('link');

    this.#styles.rel = 'stylesheet';
    this.#styles.href = './layout/header/header.css';

    document.querySelector('head').appendChild(this.#styles);

    this.#header.classList.add('head');
    this.#left.classList.add('header-info');

    this.#menuButton.classList.add('header-button');
    this.#menuButton.classList.add('header-menu-btn');
    this.#menuButton.innerHTML = 'MENU';
    this.#menuButton.addEventListener('click', () => {
      if (this.#menu.classList.contains('header-hide')) {
        this.#menu.classList.remove('header-hide');
      } else {
        this.#menu.classList.add('header-hide');
      }
    });
    this.#menu.classList.add('header-menu');
    this.#menu.classList.add('header-hide');

    this.#header.appendChild(this.#left);
    
    document.querySelector('body').appendChild(this.#header);
    document.querySelector('body').appendChild(this.#menuButton);
    document.querySelector('body').appendChild(this.#menu);

  }

  info(html) {
    this.#left.innerHTML = html;
  }

  addButton(txt, action) {
    let btn = document.createElement('button');
    btn.innerText = txt;
    btn.classList.add('header-button');
    btn.addEventListener('click', () => {
      this.#menu.classList.add('header-hide');
      action();
    });
    this.#menu.appendChild(btn);
  }
}
