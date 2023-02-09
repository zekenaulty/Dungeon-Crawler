import { EventHandler } from '../../core/eventHandler.js';

export class JoyStick extends EventHandler {

  #styles;
  #footer;
  #hand;
  #mover;
  #up;
  #down;
  #left;
  #right;


  constructor() {
    super();
    let vm = this;
    
    vm.defineEvent('up', 'down', 'left', 'right');

    vm.#styles = document.createElement('link');

    vm.#styles.rel = 'stylesheet';
    vm.#styles.href = './layout/joystick/joystick.css';

    document.querySelector('head').appendChild(vm.#styles);

    vm.#footer = document.createElement('nav');
    vm.#hand = document.createElement('button');
    vm.#mover = document.createElement('div');
    vm.#up = document.createElement('button');
    vm.#down = document.createElement('button');
    vm.#left = document.createElement('button');
    vm.#right = document.createElement('button');

    vm.#footer.classList.add('foot');
    vm.#hand.classList.add('hand');
    vm.#hand.innerHTML = '&lt;';
    vm.#footer.appendChild(vm.#hand);
    vm.#mover.classList.add('move');
    vm.#footer.appendChild(vm.#mover);

    vm.#up.classList.add('up');
    vm.#down.classList.add('down');
    vm.#left.classList.add('left');
    vm.#right.classList.add('right');

    vm.#mover.appendChild(vm.#up);
    vm.#mover.appendChild(vm.#down);
    vm.#mover.appendChild(vm.#left);
    vm.#mover.appendChild(vm.#right);

    vm.#up.innerHTML = 'UP';
    vm.#down.innerHTML = 'DOWN';
    vm.#left.innerHTML = 'LEFT';
    vm.#right.innerHTML = 'RIGHT';

    vm.#up.addEventListener('click', () => {
      vm.raiseEvent('up');
    });
    
    vm.#down.addEventListener('click', () => {
      vm.raiseEvent('down');
    });
    
    vm.#left.addEventListener('click', () => {
      vm.raiseEvent('left');
    });
    
    vm.#right.addEventListener('click', () => {
      vm.raiseEvent('right');
    });

    vm.#hand.addEventListener('click', () => {
      vm.#swap();
    });

    document.querySelector('body').appendChild(vm.#footer);

  }

  #swap() {
    let vm = this;
    if (vm.#hand.innerHTML === '&lt;') {
      vm.#footer.style.justifyContent = 'start';
      vm.#mover.style.order = 1;
      vm.#hand.style.order = 2;
      vm.#hand.innerHTML = '&gt;';
    } else {
      vm.#footer.style.justifyContent = 'end';
      vm.#hand.style.order = 1;
      vm.#mover.style.order = 2;
      vm.#hand.innerHTML = '&lt;';
    }
  }

}
