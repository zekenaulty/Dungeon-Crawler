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

  constructor(actor) {
    super();

    this.#actor = actor;

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
}

export class ActorLevel extends EventHandler {

  #actor;

  level = 1;
  baseXpToLevel = 100;
  xpLevelFactor = 0.25;
  xpToLevel = 500;
  xp = 0;

  static monsterXp(level = 1, factor = 0.05, cap = 1000, base = 50) {

  }

  constructor(actor) {
    super();

    this.#actor = actor;

    this.defineEvent(
      'leveled up',
      'gained xp',
      'lost xp');

  }

}

export class ActorInventory extends EventHandler {

  #actor;

  gold = 0;
  items = new List();

  get maxItemSlots() {
    return 40;
  }

  static monsterGold(level = 1, factor = 0.05, cap = 100, base = 10) {

  }

  constructor(actor) {
    super();

    this.#actor = actor;

    this.defineEvent(
      'inventory full',
      'item added',
      'item dropped');

  }

  addItem(item) {
    if(this.items.length === this.maxItemSlots - 1) {
      this.raiseEvent('inventory full', item);
    }
  }

}

export class Actor extends EventHandler {

  attributes;
  level;
  inventory;

  constructor() {
    super();

    this.attributes = new ActorAttributes(this);
    this.level = new ActorLevel(this);
    this.inventory = new ActorLevel(this);

    this.defineEvent(
      'leveled up',
      'health changed',
      'death');

  }

}
