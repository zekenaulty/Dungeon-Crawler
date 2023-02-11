import { List } from '../core/list.js';
import { EventHandler } from '../core/eventHandler.js'
import { Loader } from '../layout/loader/loader.js';
import { Modal } from '../layout/modal/modal.js';

export class AutoPilot extends EventHandler {

  #hero;
  #maze;
  #gameLevel;

  #breathMin = 350;
  #breathMax = 750;

  running = false;

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

    if (vm.running) {
      return;
    }
    vm.running = true;

    vm.#maze.listenToEvent('solved', vm.glSolved);
    vm.#gameLevel.listenToEvent('moved', vm.glMoved);
    vm.#gameLevel.listenToEvent('teleported', vm.glMoved);
    vm.#gameLevel.listenToEvent('won battle', vm.glWonBattle);
    vm.#gameLevel.listenToEvent('game over', vm.glGameOver);
    vm.#hero.listenToEvent('leveled up', vm.heroLevel);

    vm.runAction(() => {
      vm.nextMove();
    });
  }

  stop() {

    let vm = this;

    if (!vm.running) {
      return;
    }

    vm.#maze.ignoreEvent('solved', vm.glSolved);
    vm.#gameLevel.ignoreEvent('moved', vm.glMoved);
    vm.#gameLevel.ignoreEvent('teleported', vm.glMoved);
    vm.#gameLevel.ignoreEvent('won battle', vm.glWonBattle);
    vm.#gameLevel.ignoreEvent('game over', vm.glGameOver);
    vm.#hero.ignoreEvent('leveled up', vm.heroLevel);

    vm.running = false;

  }

  get canAct() {
    let vm = this;
    if (Modal.openCount > 0 || Loader.isOpen) {
      return false;
    }
    return vm.running;
  }

  runAction(action, force) {
    let vm = this;
    let runAction = () => {
      if (vm.canAct) {
        setTimeout(() => {
          action();
        }, vm.#breath);
      } else {
        setTimeout(() => {
          runAction(action);
        }, vm.#breath);
      }
    };

    if (vm.canAct || force) {
      runAction();
    }
  }

  #distances() {
    let vm = this;
    return vm.#maze.active.distances();
  }

  nextMove() {
    let vm = this;
    let cells = vm.#distances().pathTo(vm.#maze.end);
    let cell = cells.items[cells.items.length - 2];
    if(cells.items.length <= 2){
      cell = vm.#maze.end;
    }
    let dir = vm.#maze.active.directionOf(cell);

    vm.#gameLevel.move(dir);
  }

  glMoved() {
    let gl = this;
    gl.autoPilot.runAction(() => {
      gl.autoPilot.nextMove();
    });
  }

  glWonBattle() {
    let gl = this;
    gl.autoPilot.runAction(() => {
      gl.autoPilot.nextMove();
    });
  }

  glSolved() {
    let gl = this;
    gl.autoPilot.runAction(() => {
      gl.autoPilot.nextMove();
    }, true);
  }
  
  glGameOver() {
    let gl = this;

    gl.autoPilot.stop();
  }

  heroLevel() {
    let hero = this;
    let gl = hero.gameLevel;
    let buy = (s) => {
      if (hero.attributes.available > 0) {
        hero.attributes.available--;
        hero.attributes.available[a]++;
      }
    };

    gl.autoPilot.runAction(() => {
      buy('vitality');
      buy('vitality');
      buy('strength');
      buy('strength');
      buy('strength');
    });
  }

}
