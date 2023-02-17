import { DOM } from '../../../core/dom.js';
import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'
import { Gauge } from './gauge.js';

export class Nameplate extends EventHandler {

  #stylesheet;

  #actor;

  #box;
  #plate;
  #autoBattleBtn;

  #name;
  #level;
  #health;
  #mana;

  get healthGauge() {
    let vm = this;
    return vm.#health;
  }

  get manaGauge() {
    let vm = this;
    return vm.#mana;
  }

  constructor(container, actor) {
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

    vm.#box = document.createElement('div');
    vm.#plate = document.createElement('div');
    vm.#level = document.createElement('span');
    vm.#name = document.createElement('span');

    vm.#box.classList.add('nameplate-outer');
    vm.#plate.classList.add('nameplate');
    vm.#level.classList.add('nameplate-text');
    vm.#name.classList.add('nameplate-text');

    vm.#name.innerHTML = vm.#actor.displayName;
    vm.#level.innerHTML = 'level: ' + vm.#actor.level.level;
    vm.#name.style.padding = '2px 1px 2px 1px';
    vm.#level.style.padding = '2px 1px 2px 1px';

    vm.#plate.appendChild(vm.#name);
    vm.#plate.appendChild(vm.#level);

    vm.#health = new Gauge(
      vm.#plate,
      vm.#actor.attributes.maxHp,
      vm.#actor.attributes.hp,
      vm.#actor.attributes.health,
      '');

    vm.#mana = new Gauge(
      vm.#plate,
      vm.#actor.attributes.maxMp,
      vm.#actor.attributes.mp,
      vm.#actor.attributes.mana,
      '');
    vm.#mana.fillColor('darkblue');
    vm.#mana.borderColor('blue');

    vm.#box.appendChild(vm.#plate);
    container.appendChild(vm.#box);
  }

  get box() {
    let vm = this;
    return vm.#box;
  }

  get plate() {
    let vm = this;
    return vm.#plate;
  }

  hideLevel() {
    let vm = this;
    vm.#level.style.display = 'none';
  }

  hideName() {
    let vm = this;
    vm.#name.style.display = 'none';
  }

  hideMana() {
    let vm = this;
    vm.#mana.hide();
  }

  hideHealth() {
    let vm = this;
    vm.#health.hide();
  }

  #changed() {
    let vm = this;
    vm.#health.setMax(vm.#actor.attributes.maxHp, vm.#actor.attributes.hp);
    vm.#mana.setMax(vm.#actor.attributes.maxMp, vm.#actor.attributes.mp);
    vm.#health.barText(vm.#actor.attributes.health);
    vm.#mana.barText(vm.#actor.attributes.mana);
    vm.#name.innerHTML = vm.#actor.displayName;
    vm.#level.innerHTML = 'level: ' + vm.#actor.level.level;
  }

  update() {
    let vm = this;
    vm.#changed();
  }

  createAutoBattleButton() {
    let vm = this;

    if (vm.#autoBattleBtn) {
      return;
    }

    vm.#autoBattleBtn = DOM.button(
      '>',
      vm.#box,
      ['nameplate-auto-battle-btn'],
      () => {
        if (vm.#actor.autoBattle) {
          vm.#autoBattleBtn.classList.remove('battle-green');
          vm.#actor.autoBattle = false;
          vm.#actor.stopAi();
        } else {
          vm.#autoBattleBtn.classList.add('battle-green');
          vm.#actor.autoBattle = true;
          vm.#actor.startAi();
        }
      }
    );

    if (vm.#actor.autoBattle) {
      vm.#autoBattleBtn.classList.add('battle-green');
    }
  }

}