import { go } from './isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Modal } from './layout/modal/modal.js';
import { GameLevel } from './battle/gameLevel.js';
import { Dice } from './battle/dice.js';

(() => {

  go(() => {
    
    const game = new GameLevel();
    
    game.listenToEvent('updated', () => {
      header.info(game.summary);
    });
    
    const stageReady = (gfx) => {

      game.initialize(
        stage.width,
        stage.height,
        gfx);

      game.begin();

    };

    const header = new Header();
    const stage = new Stage(stageReady);
    const joystick = new JoyStick();

    header.addButton('SAVE', (e) => {

    });

    header.addButton('NEW GAME', (e) => {
      game.begin(true);
    });

    header.addButton('SOLVE', (e) => {
      game.solve();
    });

    header.addButton('HISTOGRAM', (e) => {
      game.histogram();
    });
    header.addButton('CHARACTER', (e) => {
      game.heroInfo();
    });

    joystick.listenToEvent('up', () => {
      game.move('north');
    });

    joystick.listenToEvent('down', () => {
      game.move('south');
    });

    joystick.listenToEvent('left', () => {
      game.move('west');
    });

    joystick.listenToEvent('right', () => {
      game.move('east');
    });

  });
})();
