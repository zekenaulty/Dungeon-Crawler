import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class AutoBattle extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 0;
    vm.register = true;
    vm.name = 'Auto-Battle';
    vm.bubble = true;
    vm.availableOutOfCombat = true;
    vm.availableOutOfCombatOnly = false;

    vm.mpCost = 0;
    vm.castTime = 0;
    vm.recoilTime = 0;
  }

  get displayName() {
    return `auto-battle`;
  }

  get summary() {
    let vm = this;
    let state = vm.actor.autoBattle ? 'ON' : 'OFF';
    return `Hero will fight automatically. (${state})`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
        vm.actor.autoBattle = !vm.actor.autoBattle;
    });
  }

}
