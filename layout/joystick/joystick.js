
export class JoyStick {
  
  #styles;
  #footer;
  #hand;
  #mover;
  #up;
  #down;
  #left;
  #right;
  
  
  constructor() {
    
    this.#styles = document.createElement('link');

    this.#styles.rel = 'stylesheet';
    this.#styles.href = './layout/joystick/joystick.css';

    document.querySelector('head').appendChild(this.#styles);

    this.#footer = document.createElement('nav');
    this.#hand = document.createElement('button');
    this.#mover = document.createElement('div');
    this.#up = document.createElement('button');
    this.#down = document.createElement('button');
    this.#left = document.createElement('button');
    this.#right = document.createElement('button');
    
    this.#footer.classList.add('foot');
    this.#hand.classList.add('hand');
    this.#hand.innerHTML = '&lt;';
    this.#footer.appendChild(this.#hand);
    this.#mover.classList.add('move');
    this.#footer.appendChild(this.#mover);
    
    this.#up.classList.add('up');
    this.#down.classList.add('down');
    this.#left.classList.add('left');
    this.#right.classList.add('right');
    
    this.#mover.appendChild(this.#up);
    this.#mover.appendChild(this.#down);
    this.#mover.appendChild(this.#left);
    this.#mover.appendChild(this.#right);
    
    this.#up.innerHTML = 'UP';
    this.#down.innerHTML = 'DOWN';
    this.#left.innerHTML = 'LEFT';
    this.#right.innerHTML = 'RIGHT';
    
    this.#up.addEventListener('click', this.up);
    this.#down.addEventListener('click', this.down);
    this.#left.addEventListener('click', this.left);
    this.#right.addEventListener('click', this.right);
    
    this.#hand.addEventListener('click', () => { this.#swap(); });

    document.querySelector('body').appendChild(this.#footer);

  }
  
  up() {}
  
  down() {}
  
  left() {}
  
  right() {}
  
  #swap() {
    if (this.#hand.innerHTML === '&lt;') {
        this.#footer.style.justifyContent = 'start';
        this.#mover.style.order = 1;
        this.#hand.style.order = 2;
        this.#hand.innerHTML = '&gt;';
      } else {
        this.#footer.style.justifyContent = 'end';
        this.#hand.style.order = 1;
        this.#mover.style.order = 2;
        this.#hand.innerHTML = '&lt;';
      }
  }
  
}
