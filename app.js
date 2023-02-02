console.log('app boot');

import { go } from './isReady.js';
import { Header } from './layout/header/header.js';

go(()=> {
  
  const header = new Header();

  setInterval(() => {
    header.info(Math.ceil(Math.random() * 20));
  }, 500);
  
  header.addButton('CHARACTER', () => {
    alert('foo');
  });
  
});
