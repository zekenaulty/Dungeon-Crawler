import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Modal } from '../../../layout/modal/modal.js';
import { MagicMissles } from '../skills/magicMissles.js';
import { Wand } from '../skills/wand.js';
import { Dice } from '../../dice.js';

export class Mage extends Actor {

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
    vm.name = 'mage';

    delete vm.skills.attack;

    vm.addSkill('wand', new Wand(vm));
    vm.addSkill('magicMissles', new MagicMissles(vm));


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
      vm.attributes.intellectLevel++;
    });

  }

  reset() {
    let vm = this;

    vm.level.level = 1;
    vm.level.xp = 0;
    vm.level.xpToLevel = ActorLevel.xpForNextLevel();

    vm.attributes.baseHp = 60;
    vm.attributes.scaleWith = 'intellect';

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
      vm.skills.magicMissles &&
      vm.enemies.length > 1 &&
      !vm.skills.magicMissles.onCd &&
      vm.attributes.mp >= vm.skills.magicMissles.mpCost &&
      Dice.d6() > 3
    ) {
      vm.skills.magicMissles.invoke();
      return;
    } else if (vm.skills.wand && !vm.skills.wand.onCd) {
      vm.skills.wand.invoke();
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
    vm.buyAttribute('intellect');
    vm.buyAttribute('vitality');

  }

}
