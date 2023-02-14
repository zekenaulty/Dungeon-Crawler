import { List } from '../core/list.js';
import { EventHandler } from '../core/eventHandler.js'
import { Loader } from '../layout/loader/loader.js';
import { Modal } from '../layout/modal/modal.js';

export class AutoPilot extends EventHandler {

  #loopId = -1;
  #party;
  #maze;
  #gameLevel;

  #breathMin = 650;
  #breathMax = 1250;

  #running = false;

  get running() {
    let vm = this;

    return vm.#running;
  }

  get #breath() {
    let vm = this;
    let r = Math.floor(Math.random() * vm.#breathMin);
    if (r < vm.#breathMin) {
      r = vm.#breathMin;
    }

    return r;
  }

  constructor(party, game, maze) {
    super();

    let vm = this;

    vm.#party = party;

    vm.#gameLevel = game;
    vm.#maze = maze;
    
    vm.#party.autoBattle();
  }

  start() {
    let vm = this;

    if (vm.#running) {
      return;
    }
    vm.#running = true;

    if (vm.#loopId > -1) {
      clearInterval(vm.#loopId);
      vm.#loopId = -1;
    }

    vm.#loopId = setInterval(() => {
      vm.#loop();
    }, vm.#breath);
  }

  #loop() {
    let vm = this;

    if (vm.#canAct) {
      vm.#nextMove();
    }

    setTimeout(() => {
      vm.#levelUp();
    }, 50);
  }

  stop() {
    let vm = this;

    vm.#running = false;
    if (vm.#loopId > -1) {
      clearInterval(vm.#loopId);
      vm.#loopId = -1;
    }
  }

  get #canAct() {
    let vm = this;
    if (Modal.openCount > 0 || Loader.isOpen) {
      return false;
    }
    return vm.#running;
  }

  #distances() {
    let vm = this;
    return vm.#maze.active.distances();
  }

  #nextMove() {
    let vm = this;
    let cells = vm.#distances().pathTo(vm.#maze.end);
    let cell = cells.items[cells.items.length - 2];
    if (cells.items.length <= 2) {
      cell = vm.#maze.end;
    }
    let dir = vm.#maze.active.directionOf(cell);

    vm.#gameLevel.move(dir);
  }

  #levelUp() {
    let vm = this;

    let buy = (s, a) => {
      
    };
/*
    while (warrior.attributes.available > 0) {
      buy('strength', warrior);
      buy('strength', warrior);
      buy('strength', warrior);
      buy('strength', warrior);
      buy('strength', warrior);
    }
*/

  }

}
