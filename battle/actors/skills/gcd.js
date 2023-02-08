import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class GCD extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 250;
    this.name = 'Global Cooldown';
  }

  get summary() {
    return 'The global cooldown for the actor, provides skills fire use gap.';
  }
  
  invoke() {
    safeInvoke(() => { /* GCD DO NOTHING */ });
  }

}

