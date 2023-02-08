import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Cleave extends ActorSkill {

  #maxCharges = 2;
  #charges = 2;

  constructor(actor) {
    super(actor);
    this.cooldown = 1000;
    this.register = true;
    this.name = 'Cleave';
    this.#charges = this.#maxCharges;
    this.minBy = -1;
    this.maxBy = -3;
  }

  get summary() {
    return `Hit each enemy for ${this.min}-${this.max} damage.`;
  }
  
  get charges() {
    return this.#charges;
  }
  
  invoke() {
    safeInvoke(() => {
      if (this.#charges > 0) {
        this.#charges--;
        for (let i = 0; i < this.actor.enemies.length; i++) {
          this.doAttack(this.actor.enemies[i]);
        }
        setTimeout(() => {
          if(this.#charges < this.#maxCharges) {
            this.#charges++;
          }
        }, 4000);
      }

    });
  }
}
