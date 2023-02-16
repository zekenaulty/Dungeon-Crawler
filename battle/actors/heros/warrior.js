import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Slam } from '../skills/slam.js';
import { Cleave } from '../skills/cleave.js';
import { Heal } from '../skills/heal.js';
import { Teleport } from '../skills/teleport.js';
import { AutoBattle } from '../skills/autoBattle.js';
import { Modal } from '../../../layout/modal/modal.js';
import { Dice } from '../../dice.js';

export class Warrior extends Actor {

  #aiIntervalMin = 850;
  #aiIntervalMax = 1250;

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

    vm.name = 'warrior';
    vm.displayName = 'Vor'

    vm.addSkill('cleave', new Cleave(vm));
    vm.addSkill('slam', new Slam(vm));

    vm.listenToEvent('leveled up', (e) => {
      vm.attributes.baseHpLevel += 20;
      if (e.level.level % 5 === 0) {
        vm.attributes.baseDamageLevel += 2;
      }

      if (e.level.level % 25 == 0) {
        vm.skills.cleave.addMaxCharge();
        vm.skills.slam.addMaxCharge();
      }

      vm.attributes.strengthLevel++;
      vm.attributes.strengthLevel++;
      vm.attributes.strengthLevel++;

      vm.recover();

    });

  }

  reset() {
    let vm = this;

    vm.autoBattle = true;

    vm.level.level = 1;
    vm.level.xp = 0;
    vm.level.xpToLevel = ActorLevel.xpForNextLevel();
    vm.attributes.scaleWith = 'strength';

    vm.attributes.baseHp = 100;

    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 25;
    vm.attributes.vitality = 20;
    vm.attributes.intellect = 10;
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
      vm.skills.heal &&
      vm.lowHealth() &&
      vm.attributes.mp >= vm.skills.heal.mpCost &&
      !vm.skills.heal.onCd
    ) {
      vm.friendlyTarget = vm;
      vm.skills.heal.invoke();
      return;
    }

    if (
      vm.enemies.length > 2 &&
      vm.skills.slam.charges > 0 &&
      !vm.skills.slam.onCd &&
      Dice.d6() > 3
    ) {
      vm.skills.slam.invoke();
      return;
    } else if (
      vm.enemies.length > 1 &&
      vm.skills.cleave.charges > 0 &&
      !vm.skills.cleave.onCd &&
      Dice.coin() == 1
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

  spendPoints() {
    let vm = this;

    vm.buyAttribute('strength');
    vm.buyAttribute('strength');
    vm.buyAttribute('strength');
    vm.buyAttribute('vitality');
    vm.buyAttribute('vitality');

  }

}
