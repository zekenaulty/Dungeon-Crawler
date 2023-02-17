import { List } from '../../core/list.js';
import { Modal } from '../../ui/modal/modal.js'
import { Dice } from '../dice.js';
import { SaveData } from '../saveData.js';
import { EventHandler } from '../../core/eventHandler.js';
import { Battle } from './battle.js';
import { Loader } from '../../ui/loader/loader.js';

export class Fight extends EventHandler {

  #party;
  #gameLevel;
  #battle;

  #running = false;

  #battleWon;
  #gameOver;
  #count = 1;

  #encounter = false;

  constructor(party, gameLevel) {
    super();
    let vm = this;

    vm.defineEvent('started', 'stopped');

    vm.#party = party;
    vm.#gameLevel = gameLevel;

    vm.#battleWon = () => {
      setTimeout(() => {
          if (vm.#battle) {
            vm.#battle.stopAi();
            vm.#battle.ignoreEvent('won battle', vm.#battleWon);
            vm.#battle.close();
            vm.#battle = undefined;
          }

          if (!vm.running) {
            return;
          }

          if (vm.#encounter) {
            vm.stop();
            return;
          }

          vm.#count++;

          if (vm.#count % 10 == 0) {
            vm.#party.each((a) => {
              a.recover();
            });
          }

          Loader.open('BATTLE ' + vm.#count);
          SaveData.save(vm.#gameLevel);
          vm.#beginBattle();
        },
        450
      );
    };

  }

  get running() {
    let vm = this;
    return vm.#running;
  }

  get encounter() {
    let vm = this;
    return vm.#encounter;
  }

  start(encounter = false) {
    let vm = this;
    if (vm.running) {
      return;
    }
    vm.#encounter = encounter;
    vm.#running = true;
    vm.#count = 1;
    vm.raiseEvent('started');
    if (encounter) {
      Loader.open('BATTLE');
    } else {
      Loader.open('BATTLE ' + vm.#count);
    }
    vm.#beginBattle();
  }

  stop() {
    let vm = this;
    if (!vm.running) {
      return;
    }
    vm.#encounter = false;
    vm.#running = false;
    vm.raiseEvent('stopped');
  }

  #beginBattle() {
    let vm = this;

    if (vm.#battle) {
      vm.#battle.stopAi();
      vm.#battle.ignoreEvent('won battle', vm.#battleWon);
      vm.#battle = undefined;
    }
    if (!vm.running) {
      return;
    }

    vm.#battle = new Battle(
      vm.#party,
      vm.#gameLevel);

    vm.#battle.listenToEvent('won battle', vm.#battleWon);

    setTimeout(() => {
        Loader.close(0);
        vm.#battle.open();
      },
      350
    );
  }

}
