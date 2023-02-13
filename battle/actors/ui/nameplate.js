import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'
import { Gauge } from './gauge.js';

export class Nameplate extends EventHandler {

  #stylesheet;

  #actor;

  constructor(actor) {
    super();

    let vm = this;

    vm.#actor = actor;

    if (!document.getElementById('nameplaye-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'nameplate-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/actors/ui/nameplate.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#nameplate-styles');
    }


  }

}
