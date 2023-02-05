import { EventHandler } from '../../core/eventHandler.js';

export class Header extends EventHandler{
  
  #header;
  #left;
  #spacer;
  #right;
  #styles;

  constructor() {
    
    super();

    this.#header = document.createElement('nav');
    this.#left = document.createElement('div');
    this.#spacer = document.createElement('div');
    this.#right = document.createElement('div');
    this.#styles = document.createElement('link');
    
    this.#styles.rel = 'stylesheet';
    this.#styles.href = './layout/header/header.css';

    document.querySelector('head').appendChild(this.#styles);
    
    this.#header.classList.add('head');
    this.#left.classList.add('header-info');
    this.#spacer.classList.add('header-spacer');
    this.#right.classList.add('header-controls');
    
    this.#header.appendChild(this.#left);
    this.#header.appendChild(this.#spacer);
    this.#header.appendChild(this.#right);

    document.querySelector('body').appendChild(this.#header);

  }
  
  info(html) {
    this.#left.innerHTML = html;
  }
  
  addButton(txt, callback) {
    let btn = document.createElement('button');
    btn.innerText = txt;
    btn.classList.add('header-button');
    btn.addEventListener('click', callback);
    this.#right.appendChild(btn);
  }
}
