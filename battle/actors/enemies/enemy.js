import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Dice } from '../../dice.js';

export class Enemy extends Actor {

  #aiId;
  #aiIntervalMin = 550;
  #aiIntervalMax = 1250;
  battle;
  
  /*  dexterity should factor 
      into these numbers 
      a.k.a. speed */
  get #aiInterval() {
    let r = Math.floor(Math.random() * this.#aiIntervalMax) + 1;
    if (r < this.#aiIntervalMin) {
      r = this.#aiIntervalMin;
    }

    return r;
  }

  constructor(gameLevel, battle, hero) {
    super(gameLevel);

    this.battle = battle;
    this.target = hero;

    this.listenToEvent('death', (e) => {
      e.actor.stopAi();
      if (e.actor.casting) {
        e.actor.casting.interupt();
      }
      e.actor.battle.removeEnemy(e.actor);
    });

  }

  aiLoop() {
    let d = Dice.roll(20);
    if(d > 18 || this.casting || this.battle.paused) {
      return;
    }
    
    if(!this.target) {
      this.target = this.battle.getTarget(false);
    }
    
    if(d > 3) {
      this.skills['attack'].invoke();
    }
    
  }

  startAi() {
    this.#aiId = setInterval(() => {
      this.aiLoop();
    }, this.#aiInterval);
  }

  stopAi() {
    clearInterval(this.#aiId);
  }
}
