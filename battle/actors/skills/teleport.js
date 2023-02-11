import { List } from '../../../core/list.js';
import { ActorSkill } from '../actorSkill.js';

export class Teleport extends ActorSkill {

  constructor(actor) {
    super(actor);
    let vm = this;
    vm.cooldown = 2000;
    vm.register = true;
    vm.name = 'Teleport';
    vm.bubble = true;
    vm.availableOutOfCombat = true;
    vm.availableOutOfCombatOnly = true;

    vm.mpCost = 10;
  }

  get displayName() {
    return `teleport`;
  }

  get summary() {
    let vm = this;
    return `Teleport to a random location in the maze.`;
  }

  invoke() {
    let vm = this;
    vm.safeInvoke(() => {
      if (vm.actor.spendMp(vm.mpCost)) {
        vm.actor.gameLevel.teleport();
      }
    });
  }

}
