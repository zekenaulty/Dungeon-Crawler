import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class ArcaneBlast extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 2000;
    vm.register = true;
    vm.name = 'Arcane Blast';
    vm.bubble = true;
    vm.mpCost = 6;
    
    vm.calcDmg();
  }
  
  calcDmg() {
    let vm = this;
    let int = vm.actor.attributes.intellect;

    vm.minBy = Math.ceil(int * 0.15);
    vm.maxBy = Math.ceil(int * 0.35);
  }


  get displayName() {
    return `arcane blast`;
  }

  get summary() {
    let vm = this;
    vm.calcDmg();
    return `Blast target for ${vm.min}-${vm.max} damage.`;
  }

  invoke() {
    let vm = this;
    vm.actor.target = vm.actor.getTarget();
    vm.calcDmg();
    vm.safeInvoke(() => {
      vm.doAttack(vm.actor.target, vm.mpCost);
    });
  }

}
