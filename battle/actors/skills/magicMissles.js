import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';


export class MagicMissles extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 4000;
    vm.register = true;
    vm.name = 'Magic Missles';
    vm.bubble = true;
    vm.mpCost = 5;
  }

  get displayName() {
    return `magic missles`;
  }
  
  calcDmg() {
    let vm = this;
    let int = vm.actor.attributes.intellect;

    vm.minBy = Math.ceil(int * 0.15);
    vm.maxBy = Math.ceil(int * 0.35);
  }


  get summary() {
    let vm = this;
    vm.calcDmg();
    return `Hit all enemies for ${vm.min}-${vm.max} damage.`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      vm.calcDmg();
      vm.actor.enemies.forEach((e) => {
        vm.doAttack(e, vm.mpCost);
      });
    });
  }

}
