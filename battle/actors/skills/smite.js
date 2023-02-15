import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class Smite extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 1500;
    vm.register = true;
    vm.name = 'Smite';
    vm.bubble = true;
    vm.minBy = -2;
    vm.maxBy = -4;
    vm.mpCost = 0;
  }

  get displayName() {
    return `smite`;
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
