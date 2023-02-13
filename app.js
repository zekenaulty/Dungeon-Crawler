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
import { Nameplate } from './battle/actors/ui/nameplate.js';
import { Actor } from './battle/actors/actor.js';

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
        waves.innerHTML = 'FIGHT WAVES';

      } else {
        game.autoPilot.stop();
        game.startGrind();
        waves.innerHTML = 'STOP WAVES';
      }
    });

    game.listenToEvent('grind started', () => {
      waves.innerHTML = 'STOP WAVES';
    });
    game.listenToEvent('grind stopped', () => {
      waves.innerHTML = 'FIGHT WAVES';
    });

    const player = header.addButton('AUTO PLAY', (e) => {
      if (game.autoPilot.running) {
        game.autoPilot.stop();
        player.innerHTML = 'AUTO PLAY';
      } else {
        game.stopGrind();
        waves.innerHTML = 'FIGHT WAVES';
        game.autoPilot.start();
        player.innerHTML = 'MANUAL PLAY';
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
    /*
    let plate = new Nameplate(
      document.querySelector('body'), 
      new Actor(game));
      */
  });
})();
