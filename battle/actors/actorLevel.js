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
        Math.ceil(base * (this.level / 2)) +
        Math.floor(amount * factor);
    }
    return amount;
  }

  constructor(actor) {
    super();

    this.#actor = actor;

    this.defineEvent(
      'leveled up',
      'gained xp',
      'lost xp'
    );
  }
  
  get xpRequired() {
    return `${this.xp}/${this.toLevelXp} (${this.toLevelXp - this.xp})`;
  }

  addXp(amount) {
    this.xp += amount;
    while (this.xp >= this.toLevelXp) {
      this.levelUp();
    }
    this.raiseEvent(
      'gained xp',
      {
        level: this,
        actor: this.#actor,
        amount: amount
      });
  }

  levelUp() {
    let level = this.level;
    this.level++;

    this.toLevelXp += ActorLevel
      .xpForNextLevel(
        this.level,
        this.toLevelXp,
        this.xpFactor,
        this.baseXpToLevel
      );

    this.raiseEvent(
      'leveled up',
      {
        level: this,
        actor: this.#actor
      });
  }
}
