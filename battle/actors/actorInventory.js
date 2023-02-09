import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

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
      this.raiseEvent(
        'inventory full',
        {
          inventory: this,
          actor: this.#actor,
          item: item
        });
    }
  }

  addGold(amount) {
    this.gold += amount;
    this.raiseEvent(
      'gold added',
      {
        inventory: this,
        actor: this.#actor,
        amount: amount
      });
  }

  loseGold(amount) {
    this.gold -= amount;
    this.raiseEvent(
      'gold lost',
      {
        inventory: this,
        actor: this.#actor,
        amount: amount
      });
  }

} /* end ActorInventory */