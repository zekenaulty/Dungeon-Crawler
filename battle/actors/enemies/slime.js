import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';
import { Enemy } from './enemy.js';

export class Slime extends Enemy {

  #slimes;
  #names;

  constructor(gameLevel, battle) {
    super(gameLevel, battle);
    let vm = this;

    vm.name = 'slime';

    vm.#slimes = new List();
    vm.#names = new List();

    vm.#slimes.push('( -  - )');
    vm.#names.push('Sizzy');

    vm.#slimes.push('( ●  ● )');
    vm.#names.push('Izzy');

    vm.#slimes.push('( ¤  ¤ )');
    vm.#names.push('Bizzy');

    vm.#slimes.push('( ○  ○ )');
    vm.#names.push('Vizzy');

    vm.#slimes.push('( □  □ )');
    vm.#names.push('Qizzy');

    vm.#slimes.push('( ◇  ◇ )');
    vm.#names.push('Lizzy');

    vm.#slimes.push('( ° ︎ ° )');
    vm.#names.push('Dizzy');

    vm.#slimes.push('( ■  ■ )');
    vm.#names.push('Wizzy');

    vm.#slimes.push('( ~  ~ )');
    vm.#names.push('Shizzy');

    vm.#slimes.push('( •  • )');
    vm.#names.push('Hizzy');

    vm.#slimes.push('( ▪  ▪︎ )');
    vm.#names.push('Fizzy');

    vm.#ascii = vm.#slimes.sample();
    vm.displayName = vm.#names[vm.#slimes.indexOf(vm.#ascii)];

  }

  #ascii;
  get ascii() {
    let vm = this;
    return vm.#slimes.sample();
  }
}