import { go } from './isReady.js';
import { List } from './core/list.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';
import { Modal } from './layout/modal/modal.js';
import { GameLevel } from './battle/gameLevel.js';
import { Item } from './battle/actors/items/item.js';
import { Actor } from './battle/actors/actor.js';

(() => {

  go(() => {
    
    const item = new Item();
    const actor = new Actor();
    
    const game = new GameLevel();
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

    });

    header.addButton('SOLVE', (e) => {

    });

    header.addButton('CHARACTER', (e) => {

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
