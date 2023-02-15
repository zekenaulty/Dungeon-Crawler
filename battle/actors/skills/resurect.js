import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Resurect extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 2000;
    vm.register = true;
    vm.name = 'Resurect';
    vm.bubble = true;
    vm.availableOutOfCombat = true;
    vm.mpCost = 20;
  }
  
  get displayName() {
    return `resurect`;
  }
  
  get summary() {
    let vm = this;
    return `Resurect a fallen ally with 50% health.`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      vm.doHeal(vm.actor.party.firstDead(), 0.5, vm.mpCost, true);
    });
  }

}
