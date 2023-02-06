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

export class GameLevel extends EventHandler {

  #level = 0;
  #mazeMaxRooms = 16;
  #toTiny = 14;
  #roomGrowthFactor = 0.3;

  #scaler;
  #renderer;
  #maze;
  #generators;
  #selectedGenerator = 7;

  constructor() {
    super();

    this.defineEvent(
      'game over',
      'won battle',
      'completed level',
      'saved',
      'loaded save');

  }

  initialize(width, height, gfx) {
    this.#scaler = new CanvasRectangleScaler(width, height);
    this.#maze = new Maze(this.#scaler.rows, this.#scaler.columns);
    this.#renderer = new CanvasRectangle(this.#maze, this.#scaler, gfx);

    this.#loadGenerators();
    this.#maze.listenToEvent('solved', () => {
      this.#nextLevel();
    });

  }
  
  begin() {
    let saveData = localStorage.getItem('DC_GAME_SAVE');
    
    if(saveData) {
      
    } else {
      this.#firstLevel();
    }
  }
  
  #firstLevel() {
    this.#level = 1;
    this.#mazeMaxRooms = 16;
    this.#resetMaze();
    setTimeout(() => {
      this.#randomGenerator().generate();
    }, 250);
  }
  
  #nextLevel() {
    this.#level++;
    this.#mazeMaxRooms += Math.ceil(this.#mazeMaxRooms * this.#roomGrowthFactor);
    this.#resetMaze();
    setTimeout(() => {
      this.#randomGenerator().generate();
    }, 250);
  }
  
  #resetMaze() {
    
    this.#scaler.setScaleBounds(this.#mazeMaxRooms, this.#toTiny);
    this.#scaler.calc();
    this.#maze.resize(this.#scaler.rows, this.#scaler.columns);
    
  }

  #getGenerator() {
    return this.#generators[this.#selectedGenerator];
  }
  
  #randomGenerator() {
    return this.#generators.sample();
  }
  
  #loadGenerators() {
    this.#generators = new List();
    this.#generators.push(new BinaryTree(this.#maze));
    this.#generators.push(new Sidewinder(this.#maze));
    this.#generators.push(new AldousBroder(this.#maze));
    this.#generators.push(new Wilsons(this.#maze));
    this.#generators.push(new HuntAndKill(this.#maze));
    this.#generators.push(new RecursiveBacktracker(this.#maze));
    this.#generators.push(new SimplePrims(this.#maze));
    this.#generators.push(new GrowingTree(this.#maze));

    this.#generators.forEach((g) => {
      g.listenToEvent('generated', () => {
        this.#renderer.draw();
      });
    });
  }
  
  move(d) {
    this.#maze.move(d);
  }

}
