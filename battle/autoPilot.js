import { List } from '../core/list.js';
import { EventHandler } from '../core/eventHandler.js'
import { Loader } from '../ui/loader/loader.js';
import { Modal } from '../ui/modal/modal.js';

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

    vm.defineEvent('started', 'stopped');

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
    vm.#lock = false;

    vm.raiseEvent('started');

    clearInterval(vm.#loopId);
    vm.#loopId = setInterval(() => {
      vm.#loop();
    }, vm.#breath);
  }

  #lock = false;
  #loop() {
    let vm = this;

    if (vm.#canAct) {
      vm.#lock = true;
      vm.#levelUp();
      vm.#nextMove();
      vm.#lock = false;
    }

  }

  stop() {
    let vm = this;
    if (!vm.running) {
      return;
    }

    vm.#running = false;
    clearInterval(vm.#loopId);
    vm.#lock = false;
    vm.raiseEvent('stopped');
  }

  get #canAct() {
    let vm = this;
    if (
      Modal.openCount > 0 ||
      Loader.isOpen ||
      vm.lock ||
      !vm.#running
    ) {
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
    vm.#party.each((a) => {
      while (a.attributes.available > 0) {
        a.spendPoints();
      }
    });
  }

}
