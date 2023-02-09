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
      'inventory full',
      'item added',
      'item dropped',
      'gold added',
      'gold lost'
    );
  }

  addItem(item) {
    let vm = this;
    if (vm.items.length === vm.maxItemSlots - 1) {
      vm.raiseEvent(
        'inventory full',
        {
          inventory: vm,
          actor: vm.#actor,
          item: item
        });
    }
  }

  addGold(amount) {
    let vm = this;
    vm.gold += amount;
    vm.raiseEvent(
      'gold added',
      {
        inventory: vm,
        actor: vm.#actor,
        amount: amount
      });
  }

  loseGold(amount) {
    let vm = this;
    vm.gold -= amount;
    vm.raiseEvent(
      'gold lost',
      {
        inventory: vm,
        actor: vm.#actor,
        amount: amount
      });
  }

}
