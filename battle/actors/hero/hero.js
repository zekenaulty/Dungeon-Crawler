import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Cleave } from '../skills/cleave.js';
import { Heal } from '../skills/heal.js';
import { Teleport } from '../skills/teleport.js';
import { AutoBattle } from '../skills/autoBattle.js';
import { Modal } from '../../../layout/modal/modal.js';

export class Hero extends Actor {

  #aiIntervalMin = 1250;
  #aiIntervalMax = 1750;

  /*  dexterity should factor 
      into these numbers 
      a.k.a. speed */
  get #aiInterval() {
    let vm = this;
    let r = Math.floor(Math.random() * vm.#aiIntervalMax) + 1;
    if (r < vm.#aiIntervalMin) {
      r = vm.#aiIntervalMin;
    }

    return r;
  }

  constructor(gameLevel) {
    super(gameLevel);
    let vm = this;
    
    vm.autoBattle = false;

    vm.attributes.baseHp = 100;

    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 50;
    vm.attributes.vitality = 40;
    vm.attributes.intellect = 10;
    vm.attributes.pointsPerLevel = 5;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;

    vm.name = 'hero';
    vm.addSkill('cleave', new Cleave(vm));
    vm.addSkill('heal', new Heal(vm));
    vm.addSkill('teleport', new Teleport(vm));
    vm.addSkill('teleport', new Teleport(vm));
    vm.addSkill('auto', new AutoBattle(vm));

  }

  aiCanAct() {
    let vm = this;

    if (vm.casting || vm.battle.paused || Modal.openCount > 1) {
      return false;
    }
    return true;
  }


  #aiId = -1;
  startAi() {
    let vm = this;
    vm.#aiLoop(); /* of course the hero gets the drop on them  */
    vm.#aiId = setInterval(() => {
      vm.#aiLoop();
    }, vm.#aiInterval);
  }

  #aiLoop() {
    let vm = this;
    
    if(!vm.aiCanAct()) {
      return;
    }

    if (
      vm.attributes.hp <= Math.floor(vm.attributes.maxHp * 0.29) &&
      vm.attributes.mp >= vm.skills.heal.mpCost &&
      !vm.skills.heal.onCd
    ) {
      vm.skills.heal.invoke();
      return;
    }

    if (
      vm.enemies.length > 1 &&
      vm.skills.cleave.charges > 0 &&
      !vm.skills.cleave.onCd
    ) {
      vm.skills.cleave.invoke();
      return;
    } else if (!vm.skills.attack.onCd) {
      vm.skills.attack.invoke();
      return;
    }
  }

  stopAi() {
    let vm = this;
    if (vm.#aiId > -1) {
      clearInterval(vm.#aiId);
    }
  }
}
