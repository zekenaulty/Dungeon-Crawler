import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class Attack extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 500;
    vm.register = true;
    vm.name = 'Attack';
    vm.bubble = true;
    vm.mpCost = 0;
  }

  get displayName() {
    return `attack`;
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