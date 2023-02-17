import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';
import { Modal } from '../../../ui/modal/modal.js';

export class Enemy extends Actor {

  #weightedTargets;

  constructor(gameLevel, battle) {
    super(gameLevel);
    let vm = this;

    vm.battle = battle;
    vm.name = 'enemy';
    vm.displayName = 'enemy';
    
    vm.autoBattle = true;

    vm.attributes.pointsPerLevel = 10;

    vm.listenToEvent('death', (e) => {
      e.stopAi();
      if (e.casting) {
        e.casting.interupt();
      }
    });

    vm.listenToEvent('leveled up', (e) => {
      vm.attributes.baseHpLevel += 15;
      vm.attributes.vitalityLevel += 2;
      vm.recover();
    });

    vm.getId();
  }

  #getWeightedTargets() {
    let vm = this;
    let l = new List();

    let w = vm.enemies.find((e) => {
      return e.name == 'warrior';
    });

    let h = vm.enemies.find((e) => {
      return e.name == 'healer';
    });

    let m = vm.enemies.find((e) => {
      return e.name == 'mage';
    });

    while (l.length < 30) {
      l.push(w);
      l.push(w);
      l.push(w);
      l.push(h);
      l.push(w);
      l.push(w);
      l.push(w);
      l.push(m);
      l.push(w);
      l.push(w);
      l.push(w);
    }

    return l;
  }

  getTarget(hostile = true) {
    let vm = this;
    if (!vm.#weightedTargets || vm.#weightedTargets.length < 30) {
      vm.#weightedTargets = vm.#getWeightedTargets();
    }

    if (vm.target && hostile && vm.target.attributes.hp > 1 && vm.enemies.includes(vm.target)) {
      return vm.target;
    }

    let t = hostile ? vm.#weightedTargets.sample() : vm.party.random();
    return t;
  }

  aiCanAct(d) {
    let vm = this;
    if (!d) {
      d = Dice.roll(20);
    }

    if (d > 18 ||
      vm.casting ||
      vm.battle.paused ||
      Modal.openCount > 1 ||
      vm.attributes.hp < 1) {
      return false;
    }

    return true;
  }

  aiLoop() {
    let vm = this;

    vm.checkLoop();
    
    let d = Dice.roll(20);

    if (vm.attributes.hp < 1) {
      vm.stopAi();
      return;
    }

    if (!vm.aiCanAct(d)) {
      return;
    }

    if (d > 3) {
      vm.skills.attack.invoke();
    }
  }

  spendPoints() {
    let vm = this;
    let stats = new List();
    stats.push('strength');
    stats.push('strength');
    stats.push('strength');
    stats.push('strength');
    stats.push('vitality');
    stats.push('strength');
    stats.push('strength');
    stats.push('vitality');
    stats.push('vitality');
    while (vm.attributes.available > 0) {
      vm.attributes.available--;
      vm.attributes[stats.sample()]++;
    }
  }

}
