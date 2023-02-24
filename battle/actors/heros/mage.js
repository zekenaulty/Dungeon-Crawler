import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Modal } from '../../../ui/modal/modal.js';
import { ArcaneBlast } from '../skills/arcaneBlast.js';
import { ArcaneWave } from '../skills/arcaneWave.js';
import { MagicMissles } from '../skills/magicMissles.js';
import { Teleport } from '../skills/teleport.js';
import { Wand } from '../skills/wand.js';
import { Dice } from '../../dice.js';

export class Mage extends Actor {

  #aiIntervalMin = 350;
  #aiIntervalMax = 650;
  #regenMana = false;

  constructor(gameLevel) {
    super(gameLevel);
    let vm = this;

    vm.reset();
    vm.name = 'mage';
    vm.displayName = 'Zyth';

    vm.aiIntervalMin = vm.#aiIntervalMin;
    vm.aiIntervalMax = vm.#aiIntervalMax;

    vm.attributes.scaleWith = 'intellect';

    delete vm.skills.attack;

    vm.addSkill('wand', new Wand(vm));
    vm.addSkill('arcaneBlast', new ArcaneBlast(vm));
    vm.addSkill('magicMissles', new MagicMissles(vm));
    vm.addSkill('arcaneWave', new ArcaneWave(vm));
    vm.addSkill('teleport', new Teleport(vm));


    vm.listenToEvent('leveled up', (e) => {
      vm.attributes.baseHpLevel += 5;
      vm.attributes.baseMpLevel += 3;

      if (e.level.level % 10 == 0) {
        vm.attributes.baseDamageLevel += 3;
      }

      vm.attributes.intellectLevel++;
      vm.attributes.intellectLevel++;

      vm.recover();

    });

  }

  reset() {
    let vm = this;

    vm.level.level = 1;
    vm.level.xp = 0;
    vm.level.xpToLevel = ActorLevel.xpForNextLevel();

    vm.attributes.baseHp = 20;
    vm.attributes.baseMp = 50;
    vm.attributes.scaleWith = 'intellect';

    vm.attributes.baseDamage = 7;
    vm.attributes.strength = 10;
    vm.attributes.vitality = 15;
    vm.attributes.intellect = 80;
    vm.attributes.pointsPerLevel = 5;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;
    
    vm.getId();
  }

  aiLoop() {
    let vm = this;

    vm.checkLoop();

    if (!vm.aiCanAct()) {
      return;
    }
    
    if(vm.lowMana(0.05)) {
      vm.#regenMana = true;
    }
    
    if(vm.#regenMana && !vm.lowMana(0.7)) {
      vm.#regenMana = false;
    }

    if (
      !vm.casting &&
      vm.skills.arcaneWave &&
      vm.enemies.length > 2 &&
      !vm.skills.arcaneWave.onCd &&
      vm.attributes.mp >= vm.skills.arcaneWave.mpCost &&
      Dice.d6() > 2 &&
      !vm.#regenMana
    ) {
      vm.skills.arcaneWave.invoke();
      return;
    } else if (
      !vm.casting  &&
      vm.skills.magicMissles &&
      vm.enemies.length > 1 &&
      !vm.skills.magicMissles.onCd &&
      vm.attributes.mp >= vm.skills.magicMissles.mpCost &&
      Dice.d6() > 1 &&
      !vm.#regenMana
    ) {
      vm.skills.magicMissles.invoke();
      return;
    } else if (
      !vm.casting &&
      vm.skills.arcaneBlast &&
      !vm.skills.arcaneBlast.onCd &&
      vm.attributes.mp >= vm.skills.arcaneBlast.mpCost &&
      Dice.d6() > 2 &&
       !vm.#regenMana
    ) {
      vm.skills.arcaneBlast.invoke();
      return;
    } else if (
      !vm.casting &&
      vm.skills.wand &&
      !vm.skills.wand.onCd
    ) {
      vm.skills.wand.invoke();
      return;
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
