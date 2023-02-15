import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class MagicMissles extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 850;
    vm.register = true;
    vm.name = 'Magic Missles';
    vm.bubble = true;
    vm.mpCost = 5;
  }

  get displayName() {
    return `magic missles`;
  }

  get summary() {
    let vm = this;
    return `Hit all enemies for ${vm.min}-${vm.max} damage.`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      vm.actor.enemies.forEach((e) => {
        vm.doAttack(e, vm.mpCost);
      });
    });
  }

}
