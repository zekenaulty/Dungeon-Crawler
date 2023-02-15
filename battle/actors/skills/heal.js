import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Heal extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 2000;
    vm.register = true;
    vm.name = 'Heal';
    vm.bubble = true;
    vm.availableOutOfCombat = true;
    vm.mpCost = 4;
  }
  
  get displayName() {
    return `heal`;
  }
  
  get summary() {
    let vm = this;
    return `Heal for 35% of max health.`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      if(!vm.actor.friendlyTarget) {
        vm.actor.friendlyTarget = vm.actor.party.lowestHealthMember();
      }
      vm.doHeal(vm.actor.friendlyTarget, 0.35, vm.mpCost);
    });
  }

}
