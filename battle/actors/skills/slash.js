import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Slash extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 750;
    vm.register = true;
    vm.name = 'Slash';
    vm.bubble = true;
    vm.mpCost = 0;
  }

  get displayName() {
    return `slash`;
  }

  get summary() {
    let vm = this;
    return `Hit target for ${vm.min}-${vm.max} damage.`;
  }

  invoke() {
    let vm = this;
    vm.actor.target = vm.actor.getTarget();
    vm.safeInvoke(() => {
      vm.doAttack(vm.actor.target);
    });
  }

}
