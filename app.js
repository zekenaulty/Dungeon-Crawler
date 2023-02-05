import { go } from './isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Maze } from './mazes/maze.js';
import { CanvasRectangle } from './mazes/renderers/canvasRectangle.js';
import { CanvasRectangleScaler } from './mazes/renderers/canvasRectangleScaler.js';
import { BinaryTree } from './mazes/generators/binaryTree.js';
import { Sidewinder } from './mazes/generators/sidewinder.js';
import { AldousBroder } from './mazes/generators/aldousBroder.js';
import { Wilsons } from './mazes/generators/wilsons.js';
import { HuntAndKill } from './mazes/generators/huntAndKill.js';
import { RecursiveBacktracker } from './mazes/generators/recursiveBacktracker.js';

import { Modal } from './layout/modal/modal.js';

(() => {

  go(() => {

    let scaler;
    let maze;
    let renderer;
    let generatorIndex = 5;

    const generators = new List();
    const generate = () => {
      generators[generatorIndex].generate();
    };

    const stageReady = (gfx) => {
      scaler = new CanvasRectangleScaler(stage.width, stage.height);
      maze = new Maze(scaler.rows, scaler.columns);
      renderer = new CanvasRectangle(maze, scaler, stage.gfx);

      generators.push(new BinaryTree(maze));
      generators.push(new Sidewinder(maze));
      generators.push(new AldousBroder(maze));
      generators.push(new Wilsons(maze));
      generators.push(new HuntAndKill(maze));
      generators.push(new RecursiveBacktracker(maze));

      generators.forEach((g) => {
        g.listenToEvent('generated', () => {
          renderer.draw();
        });
      });

      maze.listenToEvent('solved', () => {
        generate();
      });

      generate();

    };

    const header = new Header();
    const stage = new Stage(stageReady);
    const joystick = new JoyStick();

    header.addButton('SAVE', (e) => {

    });

    header.addButton('NEW GAME', (e) => {
      generate();
    });

    header.addButton('SOLVE', (e) => {
      renderer.revealSolution();
    });

    header.addButton('CHARACTER', (e) => {

    });

    joystick.listenToEvent('up', () => {
      maze.move('north');
    });

    joystick.listenToEvent('down', () => {
      maze.move('south');
    });

    joystick.listenToEvent('left', () => {
      maze.move('west');
    });

    joystick.listenToEvent('right', () => {
      maze.move('east');
    });

  });
})();
