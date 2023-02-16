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

  constructor(gameLevel) {
    super(gameLevel);
    let vm = this;

    vm.reset();

    vm.name = 'warrior';
    vm.displayName = 'Vor'

    vm.aiIntervalMin = vm.#aiIntervalMin;
    vm.aiIntervalMax = vm.#aiIntervalMax;
    
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

    vm.attributes.baseHp = 200;

    vm.attributes.baseDamage = 8;
    vm.attributes.strength = 40;
    vm.attributes.vitality = 30;
    vm.attributes.intellect = 0;
    vm.attributes.pointsPerLevel = 5;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;
  }

  aiLoop() {
    let vm = this;

    if (!vm.aiCanAct()) {
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

  spendPoints() {
    let vm = this;

    vm.buyAttribute('strength');
    vm.buyAttribute('strength');
    vm.buyAttribute('strength');
    vm.buyAttribute('vitality');
    vm.buyAttribute('vitality');

  }

}
