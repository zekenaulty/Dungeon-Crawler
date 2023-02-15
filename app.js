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


    const player = header.addButton('AUTO PLAY', (e) => {
      if (game.autoPilot.running) {
        game.autoPilot.stop();
        player.innerHTML = 'AUTO PLAY';
      } else {
        game.fightWaves.stop();
        waves.innerHTML = 'FIGHT WAVES';
        game.autoPilot.start();
        player.innerHTML = 'MANUAL PLAY';
      }
    });

    const waves = header.addButton('FIGHT WAVES', (e) => {
      if (game.fightWaves.running) {
        game.fightWaves.stop();
        waves.innerHTML = 'FIGHT WAVES';

      } else {
        game.autoPilot.stop();
        game.fightWaves.start();
        waves.innerHTML = 'STOP WAVES';
      }
    });

    const states = header.addButton('SAVES', (e) => {
      saves.open(true);
    });

    let characters; /* hax to be refactored */
    const character = header.addButton('CHARACTERS', (e) => {
      if (!characters) {
        characters = new Modal();
        characters.nav = document.createElement('span');
        characters.nav.style.position = 'fixed';
        characters.nav.style.bottom = '50px';
        characters.nav.style.left = '1vw';
        characters.nav.style.width = '98vw';
        characters.nav.style.display = 'flex';
        characters.nav.style.flexFlow = 'row';
        characters.nav.style.justifyContent = 'space-evenly';
        characters.nav.style.textAlign = 'start';
        characters.nav.style.zIndex = '31000';

        characters.warrior = new Nameplate(characters.nav, game.warrior);
        characters.healer = new Nameplate(characters.nav, game.healer);
        characters.mage = new Nameplate(characters.nav, game.mage);

        characters.warrior.box.style.width = '100px';
        characters.healer.box.style.width = '100px';
        characters.mage.box.style.width = '100px';

        characters.warrior.box.style.border = '1px dashed white';
        characters.warrior.box.style.padding = '3px 1px 6px 12px';
        characters.warrior.box.style.borderRadius = '13px 13px 13px 13px';
        characters.warrior.box.style.margin = '3px 3px 3px 3px';
        characters.warrior.box.addEventListener('click', () => {
          characters.warrior.box.style.border = '1px dashed white';
          characters.healer.box.style.border = '1px dashed transparent';
          characters.mage.box.style.border = '1px dashed transparent';
          game.healerDetail.close();
          game.mageDetail.close();
          game.warriorDetail.open();

        });

        characters.healer.box.style.padding = '3px 1px 6px 12px';
        characters.healer.box.style.borderRadius = '13px 13px 13px 13px';
        characters.healer.box.style.margin = '3px 3px 3px 3px';
        characters.healer.box.addEventListener('click', () => {
          characters.healer.box.style.border = '1px dashed white';
          characters.warrior.box.style.border = '1px dashed transparent';
          characters.mage.box.style.border = '1px dashed transparent';
          game.healerDetail.open();
          game.mageDetail.close();
          game.warriorDetail.close();

        });

        characters.mage.box.style.padding = '3px 1px 6px 12px';
        characters.mage.box.style.borderRadius = '13px 13px 13px 13px';
        characters.mage.box.style.margin = '3px 3px 3px 3px';
        characters.mage.box.addEventListener('click', () => {
          characters.mage.box.style.border = '1px dashed white';
          characters.warrior.box.style.border = '1px dashed transparent';
          characters.healer.box.style.border = '1px dashed transparent';
          game.healerDetail.close();
          game.mageDetail.open();
          game.warriorDetail.close();

        });

        characters.listenToEvent('closing', () => {
          game.healerDetail.close();
          game.mageDetail.close();
          game.warriorDetail.close();
          document.body.removeChild(characters.nav);
        });
      }
      
      characters.open(true);
      game.warriorDetail.open();
      document.body.appendChild(characters.nav);

    });

    game.listenToEvent('grind started', () => {
      waves.innerHTML = 'STOP WAVES';
    });

    game.listenToEvent('grind stopped', () => {
      waves.innerHTML = 'FIGHT WAVES';
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