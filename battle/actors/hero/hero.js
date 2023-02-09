import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Cleave } from '../skills/cleave.js';
import { Heal } from '../skills/heal.js';

export class Hero extends Actor {

  constructor(gameLevel) {
    super(gameLevel);
    let vm = this;

    vm.attributes.baseHp = 300;

    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 50;
    vm.attributes.vitality = 40;
    vm.attributes.intellect = 10;
    vm.attributes.pointsPerLevel = 10;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;

    vm.name = 'hero';
    vm.addSkill('cleave', new Cleave(vm));
    vm.addSkill('heal', new Heal(vm));
  }

}
