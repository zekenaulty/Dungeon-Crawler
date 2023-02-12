import { go } from './isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Modal } from './layout/modal/modal.js';
import { GameLevel } from './battle/gameLevel.js';
import { Dice } from './battle/dice.js';
import { Loader } from './layout/loader/loader.js';
import { Saves } from './battle/ui/saves.js';
import { Gauge } from './battle/actors/ui/gauge.js';

(() => {

  go(() => {

    Loader.open();

    history.replaceState(0, 'root');

    const game = new GameLevel();
    const saves = new Saves(game);

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

    const character = header.addButton('CHARACTER', (e) => {
      game.heroInfo();
    });

    const states = header.addButton('SAVES', (e) => {
      saves.open(true);
    });

    const waves = header.addButton('FIGHT WAVES', (e) => {
      if (game.grinding) {
        game.stopGrind();
      } else {
        game.autoPilot.stop();
        game.startGrind();
      }
    });

    const player = header.addButton('AUTO PLAY', (e) => {
      if (game.autoPilot.running) {
        game.autoPilot.stop();
      } else {
        game.stopGrind();
        game.autoPilot.start();
      }
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
