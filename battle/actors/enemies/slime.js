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
  
  constructor(gameLevel, battle, hero) {
    super(gameLevel, battle, hero);
    
    this.#slimes = new List();
    this.#slimes.push('( -  - )');
    this.#slimes.push('( ●  ● )');
    this.#slimes.push('( ¤  ¤ )');
    this.#slimes.push('( ○  ○ )');
    this.#slimes.push('( □  □ )');
    this.#slimes.push('( ◇  ◇ )');
    this.#slimes.push('( ° ︎ ° )');
    this.#slimes.push('( ■  ■ )');
    this.#slimes.push('( ~  ~ )');
    this.#slimes.push('( •  • )');
    this.#slimes.push('( ▪  ▪︎ )');

  }
  
  get ascii() {
    return this.#slimes.sample();
  }
}
