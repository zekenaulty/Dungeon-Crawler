import { List } from '../../core/list.js';
import { Modal } from '../../layout/modal/modal.js'
import { Dice } from '../dice.js';
import { Slime } from '../actors/enemies/slime.js';

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

  #combatDelayMin = 750;
  #combatDelayMax = 1550;

  get #combatDelay() {
    let r = Math.floor(Math.random() * this.#combatDelayMax) + 1;
    if (r < this.#combatDelayMin) {
      r = this.#combatDelayMin;
    }

    return r;
  }

  get paused() {
    return this.#paused;
  }

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

    this.defineEvent(
      'begin combat',
      'end combat'
    );

    this.listenToEvent('opening', (e) => {
      let count = e.modal.toSpwan();
      for (let i = 0; i < count; i++) {
        e.modal.spawn(i);
      }
      let delay = e.modal.#combatDelay;
      setTimeout(() => {
          e.modal.#paused = false;
          e.modal.raiseEvent(
            'begin combat',
            {
              battle: e.modal,
              level: e.modal.#level
            });

          e.modal.startAi();
        },
        delay
      );
    });

    this.#hero.listenToEvent('death', (e) => {
      e.actor.gameLevel.gameOver();
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
    if (d > 17) {
      m = 8;
    } else if (d > 15) {
      m = 6;
    } else if (d > 13) {
      m = 5;
    } else if (d > 11) {
      m = 4;
    } else if (d > 9) {
      m = 3;
    } else if (d > 7) {
      m = 2;
    }

    return Math.floor(Math.random() * m) + 1;
  }

  spawn(index) {
    let e = document.createElement('div');
    e.enemy = new Slime(
      this.#level,
      this,
      this.#hero
    );
    e.enemy.div = e;
    e.enemy.target = this.#hero;
    e.enemy.enemies.push(this.#hero);
    this.#hero.enemies.push(e.enemy);
    this.#enemies.push(e.enemy);
    e.id = `enemy-${index}`;
    e.innerHTML = e.enemy.ascii;
    e.classList.add('battle-enemy');

    e.enemy.listenToEvent('begin cast', (n) => {
      n.actor.div.classList.add('battle-enemy-attack');
    });

    e.enemy.listenToEvent('end recoil', (n) => {
      n.actor.div.classList.remove('battle-enemy-attack');
    });

    this.#battlefield.appendChild(e);
  }

  removeEnemy(e) {
    e.stopAi();
    this.#enemies.delete(e);
    this.#hero.enemies.delete(e);
    this.#battlefield.removeChild(e.div);
  }

  clearEnemies() {
    let l = this.#enemies.length - 1;
    for (let i = l; i >= 0; i--) {
      this.removeEnemy(this.#enemies[i]);
    }
  }

  startAi() {
    for (let i = 0; i < this.#enemies.length; i++) {
      this.#enemies[i].startAi();
    }
  }

}
