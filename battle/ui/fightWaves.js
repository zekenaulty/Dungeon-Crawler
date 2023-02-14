import { List } from '../../core/list.js';
import { Modal } from '../../layout/modal/modal.js'
import { Dice } from '../dice.js';
import { SaveData } from '../saveData.js';
import { EventHandler } from '../../core/eventHandler.js';
import { Battle } from './battle.js';
import { Loader } from '../../layout/loader/loader.js';

export class FightWaves extends EventHandler {

  #party;
  #gameLevel;
  #battle;

  #running = false;

  #battleWon;
  #gameOver;
  #count = 1;

  get running() {
    let vm = this;
    return vm.#running;
  }

  constructor(party, gameLevel) {
    super();
    let vm = this;

    vm.#party = party;
    vm.#gameLevel = gameLevel;

    vm.#battleWon = () => {
      vm.#battle.close();
      vm.#count++;
      Loader.open('BATTLE ' + vm.#count);
      SaveData.save(vm.#gameLevel);
      setTimeout(() => {
          vm.#beginBattle();
        },
        350
      );
    };

  }

  start() {
    let vm = this;
    vm.#running = true;
    vm.#count = 1;
    vm.#gameLevel.raiseEvent('grind started');
    Loader.open('BATTLE ' + vm.#count);
    vm.#beginBattle();
  }

  stop() {
    let vm = this;
    vm.#running = false;
    vm.#gameLevel.raiseEvent('grind stopped');
    if (vm.#battle) {
      vm.#battle.stopAi();
      vm.#battle.ignoreEvent('won battle', vm.#battleWon);
      vm.#battle.close();
      vm.#battle = undefined;
    }
  }

  #beginBattle() {
    let vm = this;

    if (vm.#battle) {
      vm.#battle.ignoreEvent('won battle', vm.#battleWon);
      vm.#battle = undefined;
    }

    vm.#battle = new Battle(
      vm.#party,
      vm.#gameLevel);

    vm.#battle.listenToEvent('won battle', vm.#battleWon);

    setTimeout(() => {
        Loader.close(0);
        vm.#battle.open();
      },
      750
    );
  }

}
