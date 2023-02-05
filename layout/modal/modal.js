import { EventHandler } from '../../core/eventHandler.js'

export class Modal extends EventHandler {

  #styles;
  #backdrop;
  #content;
  #closeButton;

  #isOpen = false;

  constructor() {
    super();

    this.defineEvent('opened', 'closed');

    if (!document.getElementById('modal-styles')) {
      this.#styles = document.createElement('link');
      this.#styles.id = 'modal-styles';
      this.#styles.rel = 'stylesheet';
      this.#styles.href = './layout/modal/modal.css';
      document.querySelector('head').appendChild(this.#styles);
    } else {
      this.#styles = document.querySelector('#modal-styles');
    }

    this.#backdrop = document.createElement('div');
    this.#content = document.createElement('div');
    this.#closeButton = document.createElement('button');

    this.#backdrop.classList.add('modal-bg');
    this.#content.classList.add('modal-content-container');
    this.#closeButton.classList.add('modal-close');

    this.#closeButton.innerHTML = '&times;';
    this.#closeButton.addEventListener('click', () => {
      this.close();
    });
  }

  get isOpen() {
    return this.#isOpen;
  }

  close() {
    if (this.isOpen) {
      let body = document.querySelector('body');

      if (body.dataOpenModals) {
        body.dataOpenModals -= 1;
      } else {
        body.dataOpenModals = 0;
      }
      
      body.removeChild(this.#closeButton);
      body.removeChild(this.#content);
      body.removeChild(this.#backdrop);
      
      this.#isOpen = false;
      if (body.dataOpenModals === 0) {
        body.classList.remove('modal-body-lock');
      }
    }
  }

  open(showClose) {
    if (!this.isOpen) {
      let body = document.querySelector('body');

      if (body.dataOpenModals) {
        body.dataOpenModals += 1;
      } else {
        body.dataOpenModals = 1;
      }

      this.#isOpen = true;
      if (body.dataOpenModals === 1) {
        body.classList.add('modal-body-lock');
      }
      
      body.appendChild(this.#backdrop);
      body.appendChild(this.#content);
      if (showClose) {
        body.appendChild(this.#closeButton);
      }
    }
  }

  appendChild(e) {
    if (e) {
      this.#content.appendChild(e);
    }
  }

  removeChild(e) {
    if (e) {
      this.#content.removeChild(e);
    }
  }

  setHtml(html) {
    this.#content.innerHTML = html;
  }

}
