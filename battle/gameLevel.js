import { List } from '../core/list.js';
import { EventHandler } from '../core/eventHandler.js'

import { Maze } from '../mazes/maze.js';
import { CanvasRectangle } from '../mazes/renderers/canvasRectangle.js';
import { CanvasRectangleScaler } from '../mazes/renderers/canvasRectangleScaler.js';
import { BinaryTree } from '../mazes/generators/binaryTree.js';
import { Sidewinder } from '../mazes/generators/sidewinder.js';
import { AldousBroder } from '../mazes/generators/aldousBroder.js';
import { Wilsons } from '../mazes/generators/wilsons.js';
import { HuntAndKill } from '../mazes/generators/huntAndKill.js';
import { RecursiveBacktracker } from '../mazes/generators/recursiveBacktracker.js';
import { SimplePrims } from '../mazes/generators/prims.js';
import { GrowingTree } from '../mazes/generators/growingTree.js';
import { DetailSheet } from './actors/ui/detailSheet.js';
import { Hero } from './actors/hero/hero.js';
import { Battle } from './ui/battle.js';
import { Dice } from './dice.js';
import { Loader } from '../layout/loader/loader.js';

export class GameLevel extends EventHandler {

  #level = 0;
  #mazeMaxRooms = 32;
  #toTiny = 14;
  #roomGrowthFactor = 0.3;

  #scaler;
  #renderer;
  #maze;
  #generators;

  #breath = 250;

  #hero;
  #heroDetail;
  #battle;
  #gameOverId = -1;

  saveState() {
    let vm = this;
    let heroState = vm.#hero.saveState();
    let mazeState = vm.#maze.saveState();
    localStorage.setItem('DC_LEVEL', JSON.stringify({
      level: vm.#level,
      mazeMaxRooms: vm.#mazeMaxRooms,
      toTiny: vm.#toTiny,
      roomGrowthFactor: vm.#roomGrowthFactor
    }));
    localStorage.setItem('DC_HERO', JSON.stringify(heroState));
    localStorage.setItem('DC_MAZE', JSON.stringify(mazeState));
  }

  loadState() {
    let vm = this;
    let state = JSON.parse(localStorage.getItem('DC_LEVEL'));
    let heroState = JSON.parse(localStorage.getItem('DC_HERO'));
    let mazeState = JSON.parse(localStorage.getItem('DC_MAZE'));

    vm.#level = state.level;
    vm.#mazeMaxRooms = state.mazeMaxRooms;
    vm.#toTiny = state.toTiny;
    vm.#roomGrowthFactor = state.roomGrowthFactor;

    vm.#resetMaze();

    vm.#hero = new Hero(vm);
    vm.#heroDetail = new DetailSheet(vm.#hero, true);

    vm.#hero.loadState(heroState);
    vm.#maze.loadState(mazeState);
    Loader.open();
    vm.#renderer.draw();
    Loader.close(350);
    vm.raiseEvent('updated', vm);

  }

  get level() {
    let vm = this;
    return vm.#level;
  }

  get summary() {
    let vm = this;
    return `
      <span><span class="bolder">Dungeon Level: </span>${vm.level}</span>
      <span><span class="bolder">Hero</span></span>
      <span><span class="bolder pl-1">Level: </span>${vm.#hero.level.level}</span>
      <span><span class="bolder pl-1">Health: </span>${vm.#hero.attributes.health}</span>
      <span><span class="bolder pl-1">Mana: </span>${vm.#hero.attributes.mana}</span>
    `;
    //      <span><span></span>${}</span>

  }

  constructor() {
    super();
    let vm = this;

    vm.defineEvent(
      'game over',
      'won battle',
      'completed level',
      'saved',
      'loaded save',
      'moved',
      'updated',
      'teleporting',
      'teleported'
    );

  }
  
  isHero(actor) {
    let vm = this;
    return actor === vm.#hero;
  }

  initialize(width, height, gfx) {
    let vm = this;
    vm.#scaler = new CanvasRectangleScaler(width, height);
    vm.#maze = new Maze(vm.#scaler.rows, vm.#scaler.columns);
    vm.#renderer = new CanvasRectangle(vm, vm.#maze, vm.#scaler, gfx);
    vm.#loadGenerators();
    vm.#maze.listenToEvent('solved', () => {
      vm.#nextLevel();
    });
  }

  begin(newGame = false) {
    let vm = this;
    let saveData = localStorage.getItem('DC_LEVEL');

    if (saveData && !newGame) {
      vm.loadState();
    } else {
      vm.#firstLevel();
    }
  }

  solve() {
    let vm = this;
    if (!vm.#renderer.showSolution) {
      vm.#renderer.revealSolution();
    } else {
      vm.#renderer.hideSolution();
    }
  }

  heroInfo() {
    let vm = this;
    vm.#heroDetail.open(true);
  }

  #randomMaze() {
    let vm = this;
    Loader.open();
    setTimeout(() => {
      vm.#randomGenerator().generate();
    }, vm.#breath);
  }

  #firstLevel() {
    let vm = this;
    vm.#level = 1;
    vm.#mazeMaxRooms = 32;
    vm.#resetMaze();
    vm.#randomMaze();
    vm.#hero = new Hero(vm);
    vm.#heroDetail = new DetailSheet(vm.#hero, true);
    vm.raiseEvent('updated', vm);
  }

  #nextLevel() {
    let vm = this;

    vm.#level++;
    vm.#mazeMaxRooms += Math.ceil(vm.#mazeMaxRooms * vm.#roomGrowthFactor);
    vm.#resetMaze();
    vm.#randomMaze();
    vm.#hero.recover();
  }

  #resetMaze() {
    let vm = this;

    vm.#scaler.setScaleBounds(vm.#mazeMaxRooms, vm.#toTiny);
    vm.#scaler.calc();
    vm.#maze.resize(vm.#scaler.rows, vm.#scaler.columns);

  }

  #randomGenerator() {
    let vm = this;
    return vm.#generators.sample();
  }

  #loadGenerators() {
    let vm = this;
    vm.#generators = new List();
    /* 
    vm.#generators.push(new BinaryTree(vm.#maze));
    vm.#generators.push(new Sidewinder(vm.#maze));
    vm.#generators.push(new AldousBroder(vm.#maze));
    vm.#generators.push(new Wilsons(vm.#maze));
    vm.#generators.push(new HuntAndKill(vm.#maze));
    */
    vm.#generators.push(new RecursiveBacktracker(vm.#maze));
    /*
    vm.#generators.push(new SimplePrims(vm.#maze));
    vm.#generators.push(new GrowingTree(vm.#maze));
    */

    vm.#generators.forEach((g) => {
      g.listenToEvent('generated', () => {
        setTimeout(() => {
          Loader.open();
          vm.#renderer.draw();
          vm.saveState();
          Loader.close(350);
          vm.raiseEvent('updated', vm);
        }, vm.#breath);
      });
    });
  }

  move(d) {
    let vm = this;
    if (vm.#maze.move(d)) {
      vm.raiseEvent('moved', vm);
      vm.saveState();
    } else {
      return;
    }
    
    if (vm.#maze.active == vm.#maze.end || vm.#maze.active == vm.#maze.start) {
      return;
    }

    let dice = Dice.many(20, 20, 20, 20);
    if (vm.#shouldBattle(dice)) {
      vm.beginBattle();
    } else if (vm.#shouldTeleport(dice)) {
      vm.teleport();
    }
    
    vm.raiseEvent('updated', vm);
  }

  beginBattle() {
    let vm = this;
    vm.raiseEvent('battle starting', vm);
    vm.#battle = new Battle(vm.#hero, vm);
    vm.#battle.open();
  }

  teleport() {
    let vm = this;
    vm.raiseEvent('teleporting', vm);
    let f = vm.#maze.cell(vm.#maze.active.row, vm.#maze.active.column);
    let n = vm.#maze.cells.sample();
    while (n === vm.#maze.end || n === vm.#maze.active) {
      n = vm.#maze.cells.sample();
    }
    vm.#maze.active = n;
    vm.raiseEvent('teleported', f, n, vm.#maze);
    this.saveState();
  }

  #shouldBattle(d) {
    return d[0] > 11 && d[1] < 11 && d[2] > 2 && d[3] < 20;
  }

  #shouldTeleport(d) {
    return d[0] > 18 && d[1] > 10 && d[2] > 10 && d[3] > 10;
  }

  gameOver(delay = 2250) {
    let vm = this;
    if (vm.#gameOverId > -1 || !vm.#battle) {
      return;
    }
    //alert('GAME OVER');
    vm.#gameOverId = setTimeout(() => {
      if (vm.#battle) {
        vm.#battle.clearEnemies();
        vm.#battle.close();
        vm.#battle = undefined;
        vm.#gameOverId = -1;
        vm.raiseEvent('game over', vm);

        vm.#firstLevel();
      }
    }, delay);
  }

  histogram() {
    let vm = this;
    vm.#renderer.histogram();
  }
}
