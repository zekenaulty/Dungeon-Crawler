import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class GCD extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 250;
    vm.castTime = 25;
    vm.recoilTime = 25;
    vm.name = 'Global Cooldown';
    vm.triggerGcd = false;
    vm.bubble = false;
    vm.mpCost = 0;
  }

  get summary() {
    let vm = this;
    return 'The global cooldown for the actor, provides skills fire use gap.';
  }
  
  invoke() {
    let vm = this;
    vm.safeInvoke(() => { /* GCD DO NOTHING */ });
  }

}

