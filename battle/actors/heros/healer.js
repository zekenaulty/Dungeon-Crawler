import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Slam } from '../skills/slam.js';
import { Cleave } from '../skills/cleave.js';
import { Heal } from '../skills/heal.js';
import { GroupHeal } from '../skills/groupHeal.js';
import { Teleport } from '../skills/teleport.js';
import { AutoBattle } from '../skills/autoBattle.js';
import { Modal } from '../../../layout/modal/modal.js';

export class Healer extends Actor {

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

    vm.reset();
    vm.name = 'healer';
    vm.addSkill('heal', new Heal(vm));
    vm.addSkill('groupHeal', new GroupHeal(vm));

    vm.listenToEvent('leveled up', (e) => {
      if (e.level.level % 5 === 0) {
        vm.attributes.baseHpLevel += 25;
        vm.attributes.baseMp += 10;
        vm.attributes.strengthLevel++;

        vm.recover();
      }

      if (e.level.level % 10) {
        vm.attributes.baseDamageLevel += 3;
      }

      vm.attributes.intellectLevel++;
    });

  }

  reset() {
    let vm = this;

    vm.level.level = 1;
    vm.level.xp = 0;
    vm.level.xpToLevel = ActorLevel.xpForNextLevel();

    vm.attributes.baseHp = 60;
    
    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 10;
    vm.attributes.vitality = 15;
    vm.attributes.intellect = 40;
    vm.attributes.pointsPerLevel = 5;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;
  }

  aiCanAct() {
    let vm = this;

    if (vm.casting || !vm.battle || vm.battle.paused || Modal.openCount > 1) {
      return false;
    }
    return true;
  }


  #aiId = -1;
  startAi() {
    let vm = this;
    vm.#aiId = setInterval(() => {
      vm.#aiLoop();
    }, vm.#aiInterval);
  }

  #aiLoop() {
    let vm = this;

    if (!vm.aiCanAct()) {
      return;
    }

    let critical = vm.party.lowestHealthMember();
    if (critical && !critical.lowHealth(0.65)) {
      critical = undefined;
    }

    if (
      critical &&
      vm.attributes.mp >= vm.skills.heal.mpCost &&
      !vm.skills.heal.onCd
    ) {
      vm.friendlyTarget = critical;
      vm.skills.heal.invoke();
      return;
    } else if (
      vm.party.lowHealth() &&
      vm.attributes.mp >= vm.skills.groupHeal.mpCost &&
      !vm.skills.groupHeal.onCd
    ) {
      vm.skills.groupHeal.invoke();
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

  spendPoints() {
    let vm = this;

    vm.buyAttribute('intellect');
    vm.buyAttribute('intellect');
    vm.buyAttribute('intellect');
    vm.buyAttribute('vitality');
    vm.buyAttribute('vitality');

  }

}
