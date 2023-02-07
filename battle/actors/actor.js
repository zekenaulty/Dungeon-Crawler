import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

export class ActorAttributes extends EventHandler {

  #actor;

  strength = 10;
  vitality = 20;
  intellect = 5;

  baseDamage = 3;
  baseHp = 10;
  baseMp = 10;

  hp;
  mp;

  available = 0;
  pointsPerLevel = 5;

  constructor(actor) {
    super();

    let self = this;

    this.#actor = actor;
    this.#actor.listenToEvent('constructed', () => {
      actor.listenToEvent('leveled up', () => {
        self.available += self.pointsPerLevel;
      });
    });

    this.hp = this.maxHp;
    this.mp = this.maxMp;
  }

  get maxHp() {
    return this.baseHp + (this.vitality * 2);
  }

  get maxMp() {
    return this.baseMp + (this.intellect * 2);
  }

  get minDamage() {
    return this.baseDamage + Math.floor(this.strength / 6);
  }

  get maxDamage() {
    return this.baseDamage + Math.floor(this.strength / 3);
  }
} /* end ActorAttributes */





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

  addXp(amount) {
    this.xp += amount;
    while (this.xp >= this.toLevelXp) {
      this.levelUp();
    }
    this.raiseEvent('gained xp');
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

    this.raiseEvent('leveled up');
  }
} /* end ActorLevel */





export class ActorInventory extends EventHandler {

  #actor;

  gold = 0;
  items = new List();

  get maxItemSlots() {
    return 40;
  }

  static monsterGold(
    level = 1,
    factor = 0.05,
    base = 10,
    cap = 100) {
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
      'inventory full',
      'item added',
      'item dropped',
      'gold added',
      'gold lost'
    );
  }

  addItem(item) {
    if (this.items.length === this.maxItemSlots - 1) {
      this.raiseEvent('inventory full', item);
    }
  }

  addGold(amount) {
    this.gold += amount;
    this.raiseEvent('gold added', amount);
  }

  loseGold(amount) {
    this.gold -= amount;
    this.raiseEvent('gold lost', amount);
  }

} /* end ActorInventory */





export class Actor extends EventHandler {

  attributes;
  level;
  inventory;
  skills = {};
  target;

  constructor() {
    super();

    this.level = new ActorLevel(this);
    this.attributes = new ActorAttributes(this);
    this.inventory = new ActorLevel(this);

    this.defineEvent(
      'constructed',
      'leveled up',
      'healed',
      'damaged',
      'death'
    );

    this.addSkill('GCD', new GCD(this));
    this.addSkill('attack', new BasicAttack(this));

    this.raiseEvent('constructed');
  }

  takeDamage(dmg) {
    this.attributes.hp -= dmg;
    this.raiseEvent('damaged', dmg);
    if (this.attributes.hp < 1) {
      this.raiseEvent('death');
    }
  }

  addSkill(key, skill) {
    this.skills[key] = skill;
  }


} /* end Actor */


export class ActorSkill extends EventHandler {
  actor;
  cooldown = 1500;
  lastUsed = 0;
  minBy = 0;
  maxBy = 0;
  lock = false;
  register = false;


  get now() {
    return new Date().getTime();
  }

  get onCd() {
    return this.now - this.lastUsed < this.cooldown;
  }

  get onGcd() {
    if (!this.actor.skills['GCD']) {
      return false;
    }
    return this.actor.skills['GCD'].onCd;
  }

  gcd() {
    if (!this.actor.skills['GCD']) {
      return;
    }
    this.actor.skills['GCD'].invoke();
  }

  constructor(actor) {
    super();

    this.actor = actor;

    this.resetCooldown;

  }


  doAttack(target) {
    let maxDmg = this.actor.attributes.maxDamage + this.maxBy;
    let minDmg = this.actor.attributes.minDamage + this.minBy;
    let dmg = Math.ceil(Math.random() * maxDmg) + 1;
    if (dmg < minDmg) {
      dmg = minDmg + 1;
    } else if (dmg > maxDmg) {
      dmg = maxDmg;
    }

    //TODO use dex for crit and dodge
    //TODO add chance to miss

    target.takeDamage(dmg);
  }

  invoke() {

  }

  resetCooldown() {
    this.lastUsed = this.now - this.cooldown;
  }

  refresh() {}

  safeInvoke(action) {
    if (this.lock || this.onGcd) {
      return;
    }

    this.lock = true;
    if (!this.onCd && this.actor.attributes.hp >= 1) {
      action();
      this.lastUsed = this.now;
    }
    this.lock = false;

  }

}


class GCD extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 250;
  }

  invoke() {
    safeInvoke(() => { /* GCD DO NOTHING */ });
  }

}

class BasicAttack extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 1000;
    this.register = true;
  }

  invoke(target) {
    safeInvoke(() => {
      this.doAttack(target);
    });
  }

}