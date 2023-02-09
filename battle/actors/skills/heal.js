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
    return `Heal for 25% of max health (${Math.ceil(vm.actor.attributes.maxHp * 0.25)}).`;
  }

  invoke() {
    let vm = this;
    let target = this.actor;
    if(!target) {
      target = vm.actor.getTarget(false);
    }
    vm.safeInvoke(() => {
      vm.doHeal(target, 0.25, vm.mpCost);
    });
  }

}
