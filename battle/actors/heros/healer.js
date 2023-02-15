import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Heal } from '../skills/heal.js';
import { GroupHeal } from '../skills/groupHeal.js';
import { Modal } from '../../../layout/modal/modal.js';
import { Smite } from '../skills/smite.js';
import { Resurect } from '../skills/resurect.js';

export class Healer extends Actor {

  #aiIntervalMin = 450;
  #aiIntervalMax = 950;

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
    vm.attributes.scaleWith = 'intellect';

    delete vm.skills.attack;

    vm.addSkill('smite', new Smite(vm));
    vm.addSkill('heal', new Heal(vm));
    vm.addSkill('groupHeal', new GroupHeal(vm));
    vm.addSkill('resurect', new Resurect(vm));

    vm.listenToEvent('leveled up', (e) => {
      if (e.level.level % 5 === 0) {
        vm.attributes.baseHpLevel += 25;
        vm.attributes.baseMpLevel += 10;

        vm.recover();
      }

      if (e.level.level % 10 == 0) {
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
    vm.attributes.scaleWith = 'intellect';
    vm.attributes.baseHp = 60;

    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 10;
    vm.attributes.vitality = 15;
    vm.attributes.intellect = 40;
    vm.attributes.pointsPerLevel = 5;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;
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
    
    if (
      vm.skills.resurect &&
      vm.party.firstDead() &&
      vm.attributes.mp >= vm.skills.resurect.mpCost &&
      !vm.skills.resurect.onCd
    ) {
      vm.skills.resurect.invoke();
      return;
    }

    if (
      vm.party.lowHealth() &&
      vm.attributes.mp >= vm.skills.groupHeal.mpCost &&
      !vm.skills.groupHeal.onCd
    ) {
      vm.skills.groupHeal.invoke();
    } else if (
      vm.party.lowestHealthMember().lowHealth(0.7) &&
      vm.attributes.mp >= vm.skills.heal.mpCost &&
      !vm.skills.heal.onCd
    ) {
      vm.skills.heal.invoke();
      return;
    } else if (vm.skills.smite && !vm.skills.smite.onCd) {
      vm.skills.smite.invoke();
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
