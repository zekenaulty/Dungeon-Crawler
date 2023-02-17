import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Slam extends ActorSkill {

  #maxCharges = 1;
  #charges = 1;
  #rechargeTime = 3000;

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 1000;
    vm.register = true;
    vm.name = 'Slam';
    vm.#charges = vm.#maxCharges;
    vm.mpCost = 0;
    vm.calcDmg();
  }

  addMaxCharge() {
    let vm = this;
    vm.#maxCharges++;
    vm.#charges = vm.#maxCharges;
  }

  calcDmg() {
    let vm = this;
    let str = vm.actor.attributes.strength;

    vm.minBy = Math.ceil(str * 0.15);
    vm.maxBy = Math.ceil(str * 0.35);
  }

  get displayName() {
    let vm = this;
    return `slam (${vm.charges})`;
  }

  get summary() {
    let vm = this;
    vm.calcDmg();

    return `Slam each enemy for ${vm.min}-${vm.max} damage.`;
  }

  get charges() {
    let vm = this;
    return vm.#charges;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      vm.calcDmg();

      if (vm.#charges > 0) {
        vm.#charges--;
        let last = vm.actor.enemies.length - 1;
        for (let i = last; i > -1; i--) {
          vm.doAttack(vm.actor.enemies[i]);
        }
        setTimeout(() => {
          if (vm.#charges < vm.#maxCharges) {
            vm.#charges++;
            vm.raiseEvent('updated');
          }
        }, vm.#rechargeTime);
      }

    });
  }
}
