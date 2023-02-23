import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'
import { Dice } from '../dice.js';
import { Alert } from '../../ui/alert/alert.js';

export class ActorInventory extends EventHandler {

  #actor;

  gold = 0;
  items = new List();

  get maxItemSlots() {
    return 4000;
  }

  static monsterGold(
    level = 1,
    factor = 0.02,
    base = 5
  ) {
    if (Dice.roll(10) > 8) {
      let l = Math.ceil(base * level / 3);
      return l + Math.floor(l / 2 * factor);
    }
    return 0;
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
