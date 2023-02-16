import { go } from './core/isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Modal } from './layout/modal/modal.js';
import { GameLevel } from './battle/gameLevel.js';
import { Loader } from './layout/loader/loader.js';
import { Saves } from './battle/ui/saves.js';
import { Characters } from './battle/actors/ui/characters.js'
(() => {

  go(() => {

    Loader.open();

    /* 
      used for dirty history hax 
      to allow back button to 
      close modals... 
      dev on android phone reflex
      back button user
    */
    history.replaceState(0, 'root');

    const game = new GameLevel();
    const saves = new Saves(game);
    const stageReady = (gfx) => {
      game.initialize(
        stage.width,
        stage.height,
        gfx);
      game.begin();

      game.listenToEvent('updated', () => {
        header.info(game.summary);
      });

      game.autoPilot.listenToEvent('started', () => {
        player.innerHTML = 'MANUAL PLAY';
      });

      game.autoPilot.listenToEvent('stopped', () => {
        player.innerHTML = 'AUTO PLAY';
      });

      game.fight.listenToEvent('started', () => {
        waves.innerHTML = 'STOP WAVES';
      });

      game.fight.listenToEvent('stopped', () => {
        waves.innerHTML = 'FIGHT WAVES';
      });
    };

    const header = new Header();
    const stage = new Stage(stageReady);
    const joystick = new JoyStick();

    const player = header.addButton('AUTO PLAY', (e) => {
      if (game.autoPilot.running) {
        game.autoPilot.stop();
      } else {
        game.fight.stop();
        game.autoPilot.start();
      }
    });

    const waves = header.addButton('FIGHT WAVES', (e) => {
      if (game.fight.running) {
        game.fight.stop();
      } else {
        game.autoPilot.stop();
        game.fight.start();
      }
    });

    const character = header.addButton('CHARACTERS', (e) => {
      Characters.show(game);
    });

    const states = header.addButton('SAVES', (e) => {
      saves.open(true);
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