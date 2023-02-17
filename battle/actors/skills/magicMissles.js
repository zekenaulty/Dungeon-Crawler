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
    vm.mpCost = 8;
  }

  get displayName() {
    return `magic missles`;
  }
  
  calcDmg() {
    let vm = this;
    vm.minBy = 0;
    vm.maxBy = 0
    
    vm.minBy = new Number('-' + Math.ceil(vm.min * 0.2));
    vm.maxBy = new Number('-' + Math.ceil(vm.max * 0.15));
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
