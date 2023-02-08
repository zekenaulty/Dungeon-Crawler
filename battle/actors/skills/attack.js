import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class Attack extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 1000;
    this.register = true;
    this.name = 'Attack';
  }
  
  get summary() {
    return `Hit the selected target for ${this.min}-${this.max} damage.`;
  }

  invoke() {
    safeInvoke(() => {
      this.doAttack(this.actor.target);
    });
  }

}
