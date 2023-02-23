import { go } from './core/isReady.js';
import { List } from './core/list.js';
import { Header } from './ui/header/header.js';
import { Stage } from './ui/stage/stage.js';
import { JoyStick } from './ui/joystick/joystick.js';
import { GameLevel } from './battle/gameLevel.js';
import { Loader } from './ui/loader/loader.js';
import { Saves } from './battle/ui/saves.js';
import { Characters } from './battle/actors/ui/characters.js'
import { Alert } from './ui/alert/alert.js';

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

    setTimeout(() => {
      const game = new GameLevel();
      const saves = new Saves(game);
      const stageReady = (gfx) => {

        game.initialize(
          stage.width,
          stage.height,
          gfx);
        game.begin();

        header.info(game.summary);

        game.listenToEvent('updated', () => {
          header.info(game.summary);
        });

        game.autoPilot.listenToEvent('started', () => {
          player.innerText = 'MANUAL PLAY';
        });

        game.autoPilot.listenToEvent('stopped', () => {
          player.innerText = 'AUTO PLAY';
        });

        game.fight.listenToEvent('started', () => {
          waves.innerText = 'STOP WAVES';
        });

        game.fight.listenToEvent('stopped', () => {
          waves.innerText = 'FIGHT WAVES';
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
      
      //Alert.popup('test');

    }, 350);

  });

})();