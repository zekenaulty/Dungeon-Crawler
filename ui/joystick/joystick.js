import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';

export class JoyStick extends EventHandler {

  #footer;
  #mover;

  constructor() {
    super();
    let vm = this;

    vm.defineEvent('up', 'down', 'left', 'right');

    DOM.stylesheet('./ui/joystick/joystick.css', 'joystick_styles');

    vm.#footer = DOM.nav(DOM.body, 'foot');
    vm.#mover = DOM.div(vm.#footer, 'move');
    
    DOM.button(
      'UP',
      vm.#mover,
      'up',
      () => {
        vm.raiseEvent('up');
      });

    DOM.button(
      'DOWN',
      vm.#mover,
      'down',
      () => {
        vm.raiseEvent('down');
      });

    DOM.button(
      'LEFT',
      vm.#mover,
      'left',
      () => {
        vm.raiseEvent('left');
      });

    DOM.button(
      'RIGHT',
      vm.#mover,
      'right',
      () => {
        vm.raiseEvent('right');
      });
      
  }

}
