import { go } from './isReady.js';
import { Header } from './layout/header/header.js';
import { Stage } from './layout/stage/stage.js';
import { JoyStick } from './layout/joystick/joystick.js';

(() => {

  go(() => {

    const header = new Header();
    const stage = new Stage((gfx) => {
        gfx.beginPath();
        gfx.rect(10, 10, 100, 100);
        gfx.fillStyle = 'red';
        gfx.fill();
        gfx.closePath();
      });
    const joystick = new JoyStick();

    header.addButton('SAVE', (e) => {});
    header.addButton('NEW GAME', (e) => {});
    header.addButton('SOLVE (1000g)', (e) => {});
    header.addButton('CHARACTER', (e) => {});

  });

})();
