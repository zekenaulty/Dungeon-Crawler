import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';
import { Modal } from '../../../layout/modal/modal.js';

export class Enemy extends Actor {

  #aiId;
  #aiIntervalMin = 1250;
  #aiIntervalMax = 2250;
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
    });

  }

  aiCanAct(d) {
    let vm = this;
    if (!d) {
      d = Dice.roll(20);
    }

    if (d > 18 || vm.casting || vm.battle.paused || Modal.openCount > 1) {
      return false;
    }
    return true;
  }

  aiLoop() {
    let vm = this;
    let d = Dice.roll(20);
    if (!vm.aiCanAct(d)) {
      return;
    }

    if (d > 3) {
      vm.skills.attack.invoke();
    }
    
    vm.#nextFrame();

  }

  #nextFrame(){
    /* 
      how to implememt ascii frame animations...?
      the bold and font scaling 
      already make it look bad
      
      there has to be a way to make flex not change 
      the bounds
    */
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

  spendPoints() {
    let vm = this;
    let stats = new List();
    stats.push('strength');
    stats.push('strength');
    stats.push('vitality');
    stats.push('strength');
    stats.push('strength');
    stats.push('vitality');
    while(vm.attributes.available > 0) {
      vm.attributes.available--;
      vm.attributes[stats.sample()]++;
    }
  }

}
