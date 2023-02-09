import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';

export class Enemy extends Actor {

  #aiId;
  #aiIntervalMin = 850;
  #aiIntervalMax = 1250;
  battle;

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

  constructor(gameLevel, battle, hero) {
    super(gameLevel);
    let vm = this;

    vm.battle = battle;
    vm.target = hero;

    vm.name = 'enemy';

    vm.listenToEvent('death', (e) => {
      e.actor.stopAi();
      if (e.actor.casting) {
        e.actor.casting.interupt();
      }
      e.actor.battle.removeEnemy(e.actor);
    });

  }

  aiLoop() {
    let vm = this;
    let d = Dice.roll(20);
    if (d > 18 || vm.casting || vm.battle.paused) {
      return;
    }

    if (!vm.target) {
      vm.target = vm.battle.getTarget(false);
    }

    if (d > 3) {
      let skill = vm.skills.attack;
      skill.invoke();
    }

  }

  startAi() {
    let vm = this;
    vm.#aiId = setInterval(() => {
      vm.aiLoop();
    }, vm.#aiInterval);
  }

  stopAi() {
    let vm = this;
    clearInterval(vm.#aiId);
  }
}