import { List } from '../../core/list.js';
import { Modal } from '../../layout/modal/modal.js'
import { Dice } from '../dice.js';

export class Battle extends Modal {

  #stylesheet;
  #battlefield;
  #heroInfo;
  #heroSkills;

  #hero;
  #level;
  #minMobLevel;
  #maxMobLevel;
  #enemies;
  #paused = true;

  constructor(hero, level) {
    super();

    this.#hero = hero;
    this.#level = level;
    this.#enemies = new List();
    this.#paused = true;
    this.#minMobLevel = this.#level - 2;
    this.#maxMobLevel = this.#level + 3;

    if (this.#minMobLevel < 1) {
      this.#minMobLevel = 1;
    }

    if (!document.getElementById('battle-styles')) {
      this.#stylesheet = document.createElement('link');
      this.#stylesheet.id = 'battle-styles';
      this.#stylesheet.rel = 'stylesheet';
      this.#stylesheet.href = './battle/ui/battle.css';
      document.querySelector('head').appendChild(this.#stylesheet);
    } else {
      this.#stylesheet = document.querySelector('#battle-styles');
    }

    this.#battlefield = document.createElement('div');
    this.#heroInfo = document.createElement('div');
    this.#heroSkills = document.createElement('div');

    this.#battlefield.classList.add('battle-battlefield');
    this.#heroInfo.classList.add('battle-hero-info');
    this.#heroSkills.classList.add('battle-hero-skills');

    this.appendChild(this.#battlefield);
    this.appendChild(this.#heroInfo);
    this.appendChild(this.#heroSkills);

    let self = this;
    this.listenToEvent('opening', () => {
      let count = this.toSpwan();
      for(let i = 0; i < count; i++) {
        this.spawn();
      }
    });

  }

  mobLevel() {
    if (Dice.d20() > 13) {
      let l = Math.floor(Math.random() * this.#maxMobLevel) + 1;
      if (l < this.#minMobLevel) {
        l = this.#minMobLevel;
      }

      return l;
    }

    return this.#level;
  }
  
  toSpwan() {
    let d = Dice.d20();
    let m = 1;
    if(d > 17) {
      m = 8;
    } else if (d > 15) {
      m = 6;
    } else if (d > 13) {
      m = 5;
    }  else if (d > 11) {
      m = 4;
    }  else if (d > 9) {
      m = 3;
    }  else if (d > 7) {
      m = 2;
    }
    
    return Math.floor(Math.random() * m) + 1;
  }
  
  spawn(index) {
    let e = document.createElement('div');
    e.id = `enenmy-${index}`;
    e.innerHTML = '( - - )';
    e.classList.add('battle-enemy');
    
    this.#battlefield.appendChild(e);
  }

}
