import { go } from './isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Maze } from './mazes/maze.js';
import { CanvasScaler } from './mazes/renderers/canvasScaler.js';
import { MazeToText } from './mazes/renderers/mazeToText.js';
import { BinaryTree } from './mazes/generators/binaryTree.js';

(() => {

  go(() => {

    let maze;
    let generatorIndex = 0;
    const generators = new List();
    const header = new Header();
    const stage = new Stage((gfx) => {
      
      let scaler = new CanvasScaler(stage.width, stage.height);
      scaler.calc();
      maze = new Maze(scaler.rows, scaler.columns);
      let mazeText = new MazeToText(maze);

      generators.push(new BinaryTree(maze));

      generators.forEach((g) => {
        g.onGenerated = () => {
          stage.setTextView(mazeText.text);
        };
      });
      
      generate();

    });
    const joystick = new JoyStick();

    const generate = () => {
      generators[generatorIndex].generate();
    };

    header.addButton('SAVE', (e) => {});
    header.addButton('NEW GAME', (e) => {});
    header.addButton('SOLVE (1000g)', (e) => {});
    header.addButton('CHARACTER', (e) => {});

    joystick.up = () => {};
    joystick.down = () => {};
    joystick.left = () => {};
    joystick.right = () => {};

  });

})();
