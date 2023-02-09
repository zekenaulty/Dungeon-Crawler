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
    let vm = this;
    let r = Math.floor(Math.random() * vm.#combatDelayMax) + 1;
    if (r < vm.#combatDelayMin) {
      r = vm.#combatDelayMin;
    }

    return r;
  }

  get paused() {
    let vm = this;
    return vm.#paused;
  }

  constructor(hero, level) {
    super();
    let vm = this;

    vm.#hero = hero;
    vm.#level = level;
    vm.#enemies = {};
    vm.#paused = true;
    vm.#minMobLevel = vm.#level - 2;
    vm.#maxMobLevel = vm.#level + 3;

    if (vm.#minMobLevel < 1) {
      vm.#minMobLevel = 1;
    }

    if (!document.getElementById('battle-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'battle-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/ui/battle.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#battle-styles');
    }

    vm.#battlefield = document.createElement('div');
    vm.#heroInfo = document.createElement('div');
    vm.#heroSkills = document.createElement('div');

    vm.#battlefield.classList.add('battle-battlefield');
    vm.#heroInfo.classList.add('battle-hero-info');
    vm.#heroSkills.classList.add('battle-hero-skills');

    vm.appendChild(vm.#battlefield);
    vm.appendChild(vm.#heroInfo);
    vm.appendChild(vm.#heroSkills);

    vm.defineEvent(
      'begin combat',
      'end combat'
    );

    vm.listenToEvent('opening', (e) => {
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

    vm.#hero.listenToEvent('death', (e) => {
      e.gameLevel.gameOver();
    });

  }

  mobLevel() {
    let vm = this;
    if (Dice.d20() > 13) {
      let l = Math.floor(Math.random() * vm.#maxMobLevel) + 1;
      if (l < vm.#minMobLevel) {
        l = vm.#minMobLevel;
      }

      return l;
    }

    return vm.#level;
  }

  toSpwan() {
    let vm = this;
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
    let vm = this;
    let e = document.createElement('div');
    e.id = `enemy${index}`;
    e.enemy = new Slime(
      vm.#level,
      vm,
      vm.#hero
    );
    e.enemy.id = e.id;
    e.enemy.div = e;
    e.enemy.target = vm.#hero;
    e.enemy.enemies.push(vm.#hero);
    vm.#hero.enemies.push(e.enemy);
    vm.#enemies[e.id] = e.enemy;
    e.innerHTML = e.enemy.ascii;
    e.classList.add('battle-enemy');

    e.enemy.listenToEvent('begin cast', (n) => {
      n.actor.div.classList.add('battle-enemy-attack');
    });

    e.enemy.listenToEvent('end recoil', (n) => {
      n.actor.div.classList.remove('battle-enemy-attack');
    });

    vm.#battlefield.appendChild(e);
  }

  removeEnemy(e) {
    let vm = this;
    e.stopAi();
    delete vm.#enemies[e.id];
    vm.#hero.enemies.delete(e);
    vm.#battlefield.removeChild(e.div);
  }

  clearEnemies() {
    let vm = this;
    let l = vm.#hero.enemies.length - 1;
    for (let i = l; i >= 0; i--) {
      vm.removeEnemy(vm.#hero.enemies[i]);
    }
  }

  startAi() {
    let vm = this;
    for (let i = 0; i < vm.#hero.enemies.length; i++) {
      vm.#hero.enemies[i].startAi();
    }
  }

}
