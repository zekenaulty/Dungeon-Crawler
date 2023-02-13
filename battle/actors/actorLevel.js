import { EventHandler } from '../../core/eventHandler.js'

export class ActorLevel extends EventHandler {

  #actor;

  level = 1;
  toLevelXp = 25;
  xp = 0;

  static xpForNextLevel(
    level = 1,
    factor = 0.07,
    base = 50
  ) {
    let l = Math.ceil(base * level);
    return l + Math.floor(l * factor);
  }

  static monsterXp(
    level = 1,
    factor = 0.02,
    base = 5
  ) {
    let l = Math.ceil(base * level / 3);
    return l + Math.floor(l / 2 * factor);
  }

  constructor(actor) {
    super();
    let vm = this;

    vm.#actor = actor;

    vm.defineEvent(
      'leveled up',
      'gained xp',
      'lost xp'
    );
  }

  get xpRequired() {
    let vm = this;
    return `${vm.xp}/${vm.toLevelXp} (${vm.toLevelXp - vm.xp})`;
  }

  addXp(amount) {
    let vm = this;
    vm.xp += amount;
    while (vm.xp >= vm.toLevelXp) {
      vm.levelUp();
    }
    vm.raiseEvent(
      'gained xp',
      {
        level: vm,
        actor: vm.#actor,
        amount: amount
      });
  }

  levelUp() {
    let vm = this;
    vm.level++;
    vm.#actor.attributes.available += vm.#actor.attributes.pointsPerLevel;
    vm.#actor.recover();

    vm.xp = vm.toLevelXp - vm.xp;
    if(vm.xp < 0) {
      vm.xp = 0;
    }
    
    vm.toLevelXp = ActorLevel.xpForNextLevel(
      vm.level,
      vm.xpFactor,
      vm.baseXpToLevel
    );

    vm.raiseEvent(
      'leveled up',
      {
        level: vm,
        actor: vm.#actor
      });

    vm.#actor.raiseEvent(
      'leveled up',
      {
        level: vm,
        actor: vm.#actor
      });

    vm.#actor.recover();
  }
  
}
