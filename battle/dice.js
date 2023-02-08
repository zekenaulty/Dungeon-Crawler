import { List } from '../core/list.js';

export class Dice {

  constructor() {

  }

  static roll(sides) {
    return 1 + Math.floor(Math.random() * sides);
  }

  static many() {
    let dice = new List();
    if (arguments) {
      let list = Array.isArray(arguments[0]) ? arguments[0] : arguments;
      for (let i = 0; i < list.length; i++) {
        if (!Number.isNaN(list[i])) {
          dice.push(Dice.roll(list[i]));
        }
      }
    }
    return dice;
  }

  static d20() {
    return Dice.roll(20);
  }

  static d12() {
    return Dice.roll(12);
  }

  static d6() {
    return Dice.roll(6);
  }

  static coin() {
    return Dice.roll(2);
  }

}
