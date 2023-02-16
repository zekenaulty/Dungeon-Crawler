import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Modal extends EventHandler {

  #backdrop;
  #content;
  #closeButton;

  #isOpen = false;


  #id = 0;
  #previous = -1;
  #intervalId = -1;

  static #openCount = 0;

  static get openCount() {
    return Modal.#openCount;
  }

  get content() {
    let vm = this;
    return vm.#content;
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

    DOM.stylesheet('./layout/modal/modal.css', 'modal_styles');

    vm.#backdrop = DOM.div(undefined, 'modal-bg');
    vm.#content = DOM.div(undefined, 'modal-content-container');
    vm.#closeButton = DOM.button(
      '×',
      undefined,
      'modal-close',
      () => {
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

      let e = { cancel: false, modal: vm };
      vm.raiseEvent('closing', e);
      if (e.cancel) {
        return;
      }

      vm.#isOpen = false;

      if (Modal.#openCount > 0) {
        Modal.#openCount -= 1;
      } else {
        Modal.#openCount = 0;
      }

      DOM.remove(vm.#closeButton);
      DOM.remove(vm.#backdrop);
      DOM.remove(vm.#content);

      if (Modal.#openCount < 1) {
        DOM.body.classList.remove('modal-body-lock');
      }

      if (vm.#intervalId > -1) {
        clearInterval(vm.#intervalId);
        vm.#intervalId = -1;
      }

      if (vm.#id > 0 && vm.#previous > -1) {
        if (history.state == vm.#id) {
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

      Modal.#openCount++;

      vm.#isOpen = true;
      if (Modal.#openCount === 1) {
        DOM.body.classList.add('modal-body-lock');
      }

      DOM.append(vm.#backdrop);
      DOM.append(vm.#content);
      if (showClose) {
        DOM.append(vm.#closeButton);
      }

      if (showClose) {
        vm.#previous = history.state;
        vm.#id = vm.#previous + 1
        history.pushState(vm.#id, `modal ${vm.#id}`);
        vm.#intervalId = setInterval(() => {
          if (history.state == vm.#previous) {
            clearInterval(vm.#intervalId);
            vm.#intervalId = -1;
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
