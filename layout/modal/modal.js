import { EventHandler } from '../../core/eventHandler.js';

export class Modal extends EventHandler {

  #styles;
  #backdrop;
  #content;
  #closeButton;

  #isOpen = false;

  id = 0;
  previous = -1;
  intervalId = -1;

  static #openCount = 0;

  static get openCount() {
    return Modal.#openCount;
  }

  constructor() {
    super();
    let vm = this;

    vm.defineEvent(
      'opened',
      'closed',
      'opening',
      'closing'
    );

    if (!document.getElementById('modal-styles')) {
      vm.#styles = document.createElement('link');
      vm.#styles.id = 'modal-styles';
      vm.#styles.rel = 'stylesheet';
      vm.#styles.href = './layout/modal/modal.css';
      document.querySelector('head').appendChild(vm.#styles);
    } else {
      vm.#styles = document.querySelector('#modal-styles');
    }

    vm.#backdrop = document.createElement('div');
    vm.#content = document.createElement('div');
    vm.#closeButton = document.createElement('button');

    vm.#backdrop.classList.add('modal-bg');
    vm.#content.classList.add('modal-content-container');
    vm.#closeButton.classList.add('modal-close');

    vm.#closeButton.innerHTML = '&times;';
    vm.#closeButton.addEventListener('click', () => {
      vm.close();
    });
  }

  get isOpen() {
    let vm = this;
    return vm.#isOpen;
  }

  close() {
    let vm = this;
    if (vm.isOpen) {
      vm.#isOpen = false;

      let e = { cancel: false, modal: vm };
      vm.raiseEvent('closing', e);
      if (e.cancel) {
        return;
      }

      let body = document.querySelector('body');

      if (Modal.#openCount > 0) {
        Modal.#openCount -= 1;
      } else {
        Modal.#openCount = 0;
      }

      try {
        body.removeChild(vm.#closeButton);
      } catch (e) {}
      body.removeChild(vm.#content);
      body.removeChild(vm.#backdrop);

      if (Modal.#openCount < 1) {
        body.classList.remove('modal-body-lock');
      }

      if(vm.intervalId > -1) {
        clearInterval(vm.intervalId);
        vm.intervalId = -1;
      }
      
      if (vm.id > 0 && vm.previous > -1) {
        if (history.state == vm.id) {
          history.back();
        }
      }

      vm.raiseEvent('closed', vm);
    }
  }

  open(showClose) {
    let vm = this;
    if (!vm.isOpen) {

      let e = { cancel: false, modal: vm };
      vm.raiseEvent('opening', e);
      if (e.cancel) {
        return;
      }
      let body = document.querySelector('body');

      Modal.#openCount++;

      vm.#isOpen = true;
      if (Modal.#openCount === 1) {
        body.classList.add('modal-body-lock');
      }

      body.appendChild(vm.#backdrop);
      body.appendChild(vm.#content);
      if (showClose) {
        body.appendChild(vm.#closeButton);
      }

      if (showClose) {
        vm.previous = history.state;
        vm.id = vm.previous + 1
        history.pushState(vm.id, `modal ${vm.id}`);
        vm.intervalId = setInterval(() => {
          if (history.state == vm.previous) {
            clearInterval(vm.intervalId);
            vm.intervalId = -1;
            vm.close();
          }
        }, 150);
      }

      vm.raiseEvent('opened', vm);
    }
  }

  appendChild(e) {
    let vm = this;
    if (e) {
      vm.#content.appendChild(e);
    }
  }

  removeChild(e) {
    let vm = this;
    if (e) {
      vm.#content.removeChild(e);
    }
  }

  setHtml(html) {
    let vm = this;
    vm.#content.innerHTML = html;
  }

}
