console.log('app boot');

import { go } from './isReady.js';
import { Header } from './layout/header/header.js';


(() => {

  go(() => {

    const header = new Header();

    header.addButton('SAVE', (e) => {});
    header.addButton('NEW GAME', (e) => {});
    header.addButton('SOLVE (1000g)', (e) => {});
    header.addButton('CHARACTER', (e) => {});

  });

})();