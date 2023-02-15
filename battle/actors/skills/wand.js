import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class Wand extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 1250;
    vm.register = true;
    vm.name = 'Wand';
    vm.bubble = true;
    vm.minBy = -2;
    vm.maxBy = -4;
    vm.mpCost = 0;
  }

  get displayName() {
    return `wand`;
  }

  get summary() {
    let vm = this;
    return `Hit the selected target for ${vm.min}-${vm.max} damage.`;
  }

  invoke() {
    let vm = this;
    vm.actor.target = vm.actor.getTarget();
    vm.safeInvoke(() => {
      vm.doAttack(vm.actor.target);
    });
  }

}
