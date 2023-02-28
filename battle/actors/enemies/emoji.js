import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';
import { Enemy } from './enemy.js';

export class Emoji extends Enemy {

  #stylesheet;
  #emoji;
  #names;

  constructor(gameLevel, battle) {
    super(gameLevel, battle);
    let vm = this;
    
    vm.name = 'emoji';

    vm.#emoji = new List();
    vm.#names = new List();

    vm.#emoji.push('🕷');
    vm.#names.push('Spider');

    vm.#emoji.push('🦇');
    vm.#names.push('Bat');

    vm.#emoji.push('🦂');
    vm.#names.push('Scorpion');

    vm.#emoji.push('💀');
    vm.#names.push('Skull');

    vm.#emoji.push('👹');
    vm.#names.push('Oni');

    vm.#emoji.push('👻');
    vm.#names.push('Ghost');

    vm.#emoji.push('👾');
    vm.#names.push('Octo');

    vm.#emoji.push('🐽');
    vm.#names.push('Slime');

    vm.#emoji.push('🦎');
    vm.#names.push('Lizard');

    vm.#emoji.push('🪬');
    vm.#names.push('Illumi');

    vm.#emoji.push('🪳');
    vm.#names.push('Roach');
    
    vm.#emoji.push('🐉');
    vm.#names.push('Wyrm');
    
    vm.#emoji.push('🐊');
    vm.#names.push('Gator');

    vm.#emoji.push('🐍');
    vm.#names.push('Snake');

    vm.#emoji.push('🐝');
    vm.#names.push('Bee');

    vm.#emoji.push('🦟');
    vm.#names.push('Hornet');

    vm.#emoji.push('🐌');
    vm.#names.push('Snail');

    vm.#emoji.push('☠️');
    vm.#names.push('Bones');

    vm.#emoji.push('❤️‍🔥');
    vm.#names.push('Desire');
    
    vm.#emoji.push('🧿');
    vm.#names.push('Beholder');
    
/*
    vm.#emoji.push('');
    vm.#names.push('');
*/

    vm.#ascii = vm.#emoji.sample();
    vm.displayName = vm.#names[vm.#emoji.indexOf(vm.#ascii)];
    vm.name = vm.displayName.toLowerCase();
  }

  #ascii;
  get ascii() {
    let vm = this;
    return vm.#ascii;
  }
}
