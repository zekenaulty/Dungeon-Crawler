import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class GroupHeal extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 6000;
    vm.register = true;
    vm.name = 'Group Heal';
    vm.bubble = true;
    vm.availableOutOfCombat = true;
    vm.mpCost = 8;
  }
  
  get displayName() {
    return `group heal`;
  }
  
  get summary() {
    let vm = this;
    return `Heal party for 25% of max health (${Math.ceil(vm.actor.attributes.maxHp * 0.25)}).`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      vm.actor.party.each((actor) => {
        vm.doHeal(actor, 0.25, vm.mpCost);
      });
    });
  }

}
