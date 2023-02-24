import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';

export class JoyStick extends EventHandler {

  #footer;
  #mover;
  #check;

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
      
    let group = DOM.div(vm.#footer, 'random-group');
    vm.#check = DOM.input('checkbox', group, 'random-check', 'random_battles');
    DOM.label('random encounters?', group, 'random-label', 'random_battles');
    
  }
  
  onEncountersChanged(action){
    let vm = this;
    vm.#check.addEventListener('change', action);
  }

  setChecked(checked) {
    let vm = this;
    vm.#check.checked = checked;
  }
}
