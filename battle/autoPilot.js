import { List } from '../core/list.js';
import { EventHandler } from '../core/eventHandler.js'
import { Loader } from '../layout/loader/loader.js';
import { Modal } from '../layout/modal/modal.js';

export class AutoPilot extends EventHandler {

  #loopId = -1;
  #hero;
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

  constructor(hero, game, maze) {
    super();

    let vm = this;

    vm.#hero = hero;
    vm.#gameLevel = game;
    vm.#maze = maze;
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
    let hero = vm.#hero;
    
    if (vm.#canAct) {
      if(hero.lowHealth() && hero.skills.heal.canCast) {
        hero.skills.heal.invoke();
      } else {
        vm.#nextMove();
      }
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
    let hero = vm.#hero;
    let buy = (s) => {
      if (hero.attributes.available > 0) {
        hero.attributes.available--;
        hero.attributes[s]++;
      }
    };
    while (hero.attributes.available > 0) {
      buy('vitality');
      buy('vitality');
      buy('strength');
      buy('strength');
      buy('strength');
    }
  }

}
