import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Cleave extends ActorSkill {

  #maxCharges = 2;
  #charges = 2;
  #rechargeTime = 2500;

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 500;
    vm.register = true;
    vm.name = 'Cleave';
    vm.#charges = vm.#maxCharges;
    vm.minBy = -1;
    vm.maxBy = -3;
  }

  get displayName() { 
    let vm = this;
    return `cleave (${vm.charges})`;
  }
  
  get summary() {
    let vm = this;
    return `Hit each enemy for ${vm.min}-${vm.max} damage.`;
  }
  
  get charges() {
    let vm = this;
    return vm.#charges;
  }
  
  invoke() {
    let vm = this;
    this.safeInvoke(() => {
      if (vm.#charges > 0) {
        vm.#charges--;
        let last = vm.actor.enemies.length - 1;
        for (let i = last; i > -1; i--) {
          vm.doAttack(vm.actor.enemies[i]);
        }
        setTimeout(() => {
          if(vm.#charges < vm.#maxCharges) {
            vm.#charges++;
            vm.raiseEvent('updated');
          }
        }, vm.#rechargeTime);
      }

    });
  }
}
