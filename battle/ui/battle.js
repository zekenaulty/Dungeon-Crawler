import { List } from '../../core/list.js';
import { Modal } from '../../layout/modal/modal.js'
import { Dice } from '../dice.js';
import { Slime } from '../actors/enemies/slime.js';
import { ActorLevel } from '../actors/actorLevel.js';
import { ActorInventory } from '../actors/actorInventory.js';
import { DetailSheet } from '../actors/ui/detailSheet.js';
import { SaveData } from '../saveData.js';
import { Nameplate } from '../actors/ui/nameplate.js';

export class Battle extends Modal {

  #stylesheet;
  #battlefield;
  #partyInfo;
  #warriorSkills;
  #pauseBtn;

  #warriorPlate;
  #healerPlate;

  #warrior;
  #healer;
  
  #level;
  #minMobLevel;
  #maxMobLevel;
  #enemies;
  #paused = true;

  #combatDelayMin = 400;
  #combatDelayMax = 750;

  #endGrind;

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

  constructor(warrior, healer, level) {
    super();
    let vm = this;

    vm.#warrior = warrior;
    vm.#healer = healer;
    vm.#warrior.battle = vm;

    vm.#level = level;
    vm.#enemies = new List();
    vm.#paused = true;
    vm.#minMobLevel = vm.#level.level - 2;
    vm.#maxMobLevel = vm.#level.level + 3;

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
    vm.#partyInfo = document.createElement('div');
    vm.#warriorSkills = document.createElement('div');
    vm.#pauseBtn = document.createElement('button');
    vm.#pauseBtn.innerHTML = 'pause';

    vm.#battlefield.classList.add('battle-battlefield');
    vm.#partyInfo.classList.add('battle-warrior-info');
    vm.#warriorSkills.classList.add('battle-warrior-skills');
    vm.#pauseBtn.classList.add('battle-warrior-btn');
    vm.#pauseBtn.classList.add('battle-pause');

    vm.#warriorPlate = new Nameplate(vm.#partyInfo, vm.#warrior);
    vm.#healerPlate = new Nameplate(vm.#partyInfo, vm.#healer);

    vm.partyInfo();
    vm.warriorSkills();

    vm.#pauseBtn.addEventListener('click', () => {
      if (vm.#paused) {
        vm.#paused = false;
        vm.#pauseBtn.classList.remove('battle-green');
        vm.#pauseBtn.innerHTML = 'pause';
      } else {
        vm.#pauseBtn.classList.add('battle-green');
        vm.#pauseBtn.innerHTML = 'paused';
        vm.#paused = true;
      }
    });

    vm.appendChild(vm.#battlefield);
    vm.appendChild(vm.#partyInfo);
    vm.appendChild(vm.#warriorSkills);
    vm.appendChild(vm.#pauseBtn);

    vm.defineEvent(
      'begin combat',
      'end combat',
      'won battle'
    );

    vm.listenToEvent('opening', (e) => {
      let count = vm.toSpwan();
      for (let i = 0; i < count; i++) {
        vm.spawn(i);
      }
      let delay = vm.#combatDelay;
      setTimeout(() => {
          vm.#paused = false;
          vm.raiseEvent(
            'begin combat',
            {
              battle: vm,
              level: vm.#level
            });

          vm.startAi();
        },
        delay
      );
    });

    vm.#warrior.listenToEvent('damaged', (actor, dmg) => {
      vm.partyInfo();
    });

    vm.#healer.listenToEvent('damaged', (actor, dmg) => {
      vm.partyInfo();
    });

    vm.#warrior.listenToEvent('death', (e) => {
      vm.#paused = true;
      vm.raiseEvent('end combat', vm);
      vm.#warrior.stopAi();
      e.gameLevel.gameOver();
    });

    if (vm.#level.grinding) {
      vm.#endGrind = document.createElement('button');
      vm.#endGrind.innerHTML = 'stop waves';
      vm.#endGrind.classList.add('battle-end-grind');
      vm.#endGrind.classList.add('battle-green');

      vm.appendChild(vm.#endGrind);

      vm.#endGrind.addEventListener('click', () => {
        if (vm.#level.grinding) {
          vm.#level.stopGrind();
          vm.#endGrind.innerHTML = 'fight waves';
          vm.#endGrind.classList.remove('battle-green');
        } else {
          vm.#level.startGrind();
          vm.#endGrind.innerHTML = 'stop waves';
          vm.#endGrind.classList.add('battle-green');
        }
      });
    }

  }

  partyInfo() {
    let vm = this;

    vm.#warriorPlate.update();
    vm.#healerPlate.update();

  }

  warriorSkills() {
    let vm = this;
    for (let k in vm.#warrior.skills) {
      let skill = vm.#warrior.skills[k];
      if (skill.register && !skill.availableOutOfCombatOnly) {
        let btn = document.createElement('button');
        btn.innerHTML = skill.displayName;
        btn.classList.add('battle-warrior-btn');
        btn.addEventListener('click', () => {
          if (vm.#paused || Modal.openCount > 1) {
            return;
          }

          skill.invoke();
        });
        let begin = () => {
          btn.classList.add('battle-warrior-btn-active');
        };
        let done = () => {
          btn.classList.remove('battle-warrior-btn-active');
        };
        let update = () => {
          if (skill.displayName == 'auto-battle') {
            if (vm.#warrior.autoBattle) {
              btn.classList.add('battle-green');
              vm.#warrior.startAi();
            } else {
              btn.classList.remove('battle-green');
              vm.#warrior.stopAi();
            }
            vm.appendChild(btn);
          }
          btn.innerHTML = skill.displayName;
          vm.partyInfo();
        };

        skill.listenToEvent('begin cast', begin);
        skill.listenToEvent('end recoil', done);
        skill.listenToEvent('updated', update);
        skill.listenToEvent('end cast', update);

        vm.listenToEvent('closing', () => {
          skill.ignoreEvent('updated', update);
          skill.ignoreEvent('end cast', update);
          skill.ignoreEvent('end recoil', done);
          skill.ignoreEvent('begin cast', begin);
        });

        if (skill.displayName == 'auto-battle') {
          btn.classList.add('auto-battle');
          if (vm.#warrior.autoBattle) {
            btn.classList.add('battle-green');
          }
          vm.appendChild(btn);
        } else {
          vm.#warriorSkills.appendChild(btn);
        }
      }
    }
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

    return vm.#level.level;
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
    e.plateDiv = document.createElement('div');
    e.enemyDiv = document.createElement('div');
    e.appendChild(e.plateDiv);
    e.appendChild(e.enemyDiv);
    e.id = `enemy${index}`;
    e.enemy = new Slime(
      vm.#level,
      vm,
      vm.#warrior
    );

    let l = vm.mobLevel();
    while (e.enemy.level.level < l) {
      e.enemy.level.levelUp();
    }
    e.enemy.spendPoints();
    e.enemy.recover();
    e.plate = new Nameplate(e, e.enemy);
    e.plate.hideLevel();
    e.plate.hideName();
    e.plate.hideMana();

    e.enemy.id = e.id;
    e.enemy.div = e;
    e.enemy.target = vm.#warrior;
    e.enemy.enemies.push(vm.#warrior);
    e.details = new DetailSheet(e.enemy);
    e.details.listenToEvent('opening', () => {
      vm.#battlefield.classList.add('battle-hide');
      vm.#partyInfo.classList.add('battle-hide');
      vm.#warriorSkills.classList.add('battle-hide');
    });
    e.details.listenToEvent('closed', () => {
      vm.#battlefield.classList.remove('battle-hide');
      vm.#partyInfo.classList.remove('battle-hide');
      vm.#warriorSkills.classList.remove('battle-hide');
    });
    vm.#warrior.enemies.push(e.enemy);
    vm.#enemies.push(e.enemy);
    e.enemyDiv.innerHTML = e.enemy.ascii;
    e.enemyDiv.classList.add('battle-enemy');

    e.addEventListener('dblclick', () => {
      e.details.open(true);
    });

    e.addEventListener('click', () => {
      vm.#warrior.target = e.enemy;
    });

    e.enemy.listenToEvent('begin cast', (n) => {
      n.actor.div.enemyDiv.classList.add('battle-enemy-attack');
    });

    e.enemy.listenToEvent('end recoil', (n) => {
      n.actor.div.enemyDiv.classList.remove('battle-enemy-attack');
    });

    e.enemy.listenToEvent('damaged', (actor, dmg) => {
      e.enemyDiv.classList.add('battle-dmg');
      e.plate.update();
      setTimeout(() => {
        e.enemyDiv.classList.remove('battle-dmg');
      }, 250);
    });

    e.enemy.listenToEvent('death', (n) => {
      e.enemy.battle.removeEnemy(e.enemy);
      e.style.visibility = 'hidden';
      vm.#warrior.level.addXp(ActorLevel.monsterXp(e.enemy.level.level));
      if (vm.#enemies.length < 1) {
        vm.#warrior.stopAi();
        vm.raiseEvent('end combat', vm);
        SaveData.save(vm.#level);
        vm.#level.raiseEvent('updated', vm.#level);
        vm.close();
        vm.raiseEvent('won battle', vm);
      }
    });

    vm.#battlefield.appendChild(e);
  }

  removeEnemy(e) {
    let vm = this;
    e.stopAi();
    vm.#enemies.delete(e);
    vm.#warrior.enemies.delete(e);
  }

  clearEnemies(delay = 0) {
    let vm = this;
    vm.#paused = true;
    let l = vm.#warrior.enemies.length - 1;
    for (let i = l; i >= 0; i--) {
      vm.removeEnemy(vm.#warrior.enemies[i], delay);
    }
  }

  startAi() {
    let vm = this;
    if (vm.#warrior.autoBattle) {
      vm.#warrior.startAi();
    }
    for (let i = 0; i < vm.#warrior.enemies.length; i++) {
      vm.#warrior.enemies[i].startAi();
    }
  }

}
