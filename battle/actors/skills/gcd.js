import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class GCD extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 250;
    this.castTime = 25;
    this.recoilTime = 25;
    this.name = 'Global Cooldown';
    this.triggerGcd = false;
    this.bubble = false;
  }

  get summary() {
    return 'The global cooldown for the actor, provides skills fire use gap.';
  }
  
  invoke() {
    this.safeInvoke(() => { /* GCD DO NOTHING */ });
  }

}

