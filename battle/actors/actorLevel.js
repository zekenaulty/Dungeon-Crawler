import { EventHandler } from '../../core/eventHandler.js'

export class ActorLevel extends EventHandler {

  #actor;

  level = 1;
  toLevelXp = 500;
  xp = 0;

  static xpForNextLevel(
    level = 1,
    toLevelXp = 500,
    xpFactor = 0.25,
    baseXpToLevel = 100
  ) {
    return baseXpToLevel * level + Math.floor(toLevelXp * xpFactor);
  }

  static monsterXp(
    level = 1,
    factor = 0.05,
    base = 10,
    cap = 1000
  ) {
    let amount = 0;
    for (let l = 1; l <= level; l++) {
      if (amount >= cap) {
        break;
      }
      amount +=
        Math.ceil(base * (vm.level / 2)) +
        Math.floor(amount * factor);
    }
    return amount;
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
    let level = vm.level;
    vm.level++;

    vm.toLevelXp += ActorLevel
      .xpForNextLevel(
        vm.level,
        vm.toLevelXp,
        vm.xpFactor,
        vm.baseXpToLevel
      );

    vm.raiseEvent(
      'leveled up',
      {
        level: vm,
        actor: vm.#actor
      });
  }
}
