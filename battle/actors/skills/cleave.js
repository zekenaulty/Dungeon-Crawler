import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Cleave extends ActorSkill {

  #maxCharges = 2;
  #charges = 2;

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 1000;
    vm.register = true;
    vm.name = 'Cleave';
    vm.#charges = vm.#maxCharges;
    vm.minBy = -1;
    vm.maxBy = -3;
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
    safeInvoke(() => {
      if (vm.#charges > 0) {
        vm.#charges--;
        for (let i = 0; i < vm.actor.enemies.length; i++) {
          vm.doAttack(vm.actor.enemies[i]);
        }
        setTimeout(() => {
          if(vm.#charges < vm.#maxCharges) {
            vm.#charges++;
          }
        }, 4000);
      }

    });
  }
}
