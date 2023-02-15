import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'
import { Gauge } from './gauge.js';

export class Nameplate extends EventHandler {

  #stylesheet;

  #actor;

  #box;

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
    vm.#level = document.createElement('span');
    vm.#name = document.createElement('span');

    vm.#box.classList.add('nameplate');

    vm.#name.innerHTML = vm.#actor.name;
    vm.#level.innerHTML = 'level: ' + vm.#actor.level.level;
    vm.#name.style.padding = '2px 1px 2px 1px';
    vm.#level.style.padding = '2px 1px 2px 1px';
    
    vm.#box.appendChild(vm.#name);
    vm.#box.appendChild(vm.#level);

    vm.#health = new Gauge(
      vm.#box,
      vm.#actor.attributes.maxHp,
      vm.#actor.attributes.hp,
      vm.#actor.attributes.health,
      '');
    //vm.#health.labelWidth('38px');
    //vm.#health.barWidth('75px');

    vm.#mana = new Gauge(
      vm.#box,
      vm.#actor.attributes.maxMp,
      vm.#actor.attributes.mp,
      vm.#actor.attributes.mana,
      '');
    //vm.#mana.labelWidth('38px');
    //vm.#mana.barWidth('75px');
    vm.#mana.fillColor('darkblue');
    vm.#mana.borderColor('blue');

    container.appendChild(vm.#box);
    vm.#change = () => {
      vm.#changed();
    };
    //vm.#actor.listenToEvent('changed', vm.#change);

  }
  
  get box() {
    let vm = this;
    return vm.#box;
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

  #change;
  #changed() {
    let vm = this;
    vm.#health.setMax(vm.#actor.attributes.maxHp, vm.#actor.attributes.hp);
    vm.#mana.setMax(vm.#actor.attributes.maxMp, vm.#actor.attributes.mp);
    vm.#health.barText(vm.#actor.attributes.health);
    vm.#mana.barText(vm.#actor.attributes.mana);
    vm.#name.innerHTML = vm.#actor.name;
    vm.#level.innerHTML = 'level: ' + vm.#actor.level.level;
  }

  update() {
    let vm = this;
    vm.#changed();
  }

  release() {
    let vm = this;
    //vm.#actor.ignoreEvent('changed', vm.#change);
  }

}
