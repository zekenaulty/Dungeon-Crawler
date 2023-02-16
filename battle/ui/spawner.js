import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js';
import { Modal } from '../../layout/modal/modal.js'
import { Dice } from '../dice.js';
import { Slime } from '../actors/enemies/slime.js';
import { ActorLevel } from '../actors/actorLevel.js';
import { ActorInventory } from '../actors/actorInventory.js';
import { DetailSheet } from '../actors/ui/detailSheet.js';
import { SaveData } from '../saveData.js';
import { Nameplate } from '../actors/ui/nameplate.js';

export class Spawner extends EventHandler {

  #gameLevel;
  #battle;
  #party;

  #minMobLevel;
  #maxMobLevel;

  #combatDelayMin = 400;
  #combatDelayMax = 750;

  constructor(party, gameLevel, battle) {
    super();

    let vm = this;

    vm.#party = party;
    vm.#battle = battle;
    vm.#gameLevel = gameLevel;

  }

  get #combatDelay() {
    let vm = this;
    let r = Math.floor(Math.random() * vm.#combatDelayMax) + 1;
    if (r < vm.#combatDelayMin) {
      r = vm.#combatDelayMin;
    }

    return r;
  }


  spawn() {
    let vm = this;
    let count = vm.#spawnCount();
    for (let i = 0; i < count; i++) {
      vm.#addEnemey(i);
    }
    let delay = vm.#combatDelay;
    setTimeout(() => {
        vm.#gameLevel.raiseEvent(
          'begin combat',
          {
            battle: vm,
            level: vm.#gameLevel
          });

        vm.#battle.startAi();
      },
      delay
    );

  }

  #mobLevel() {
    let vm = this;

    vm.#minMobLevel = vm.#gameLevel.level - 2;
    vm.#maxMobLevel = vm.#gameLevel.level + 3;

    if (vm.#minMobLevel < 1) {
      vm.#minMobLevel = vm.#gameLevel.level;
    }

    if (Dice.d20() > 13) {
      let l = Math.floor(Math.random() * vm.#maxMobLevel) + 1;
      if (l < vm.#minMobLevel) {
        l = vm.#minMobLevel;
      }

      return l;
    }

    return vm.#gameLevel.level;
  }

  #spawnCount() {
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

  #addEnemey(index) {
    let vm = this;
    let e = vm.#createEnemyLayout(index);

    vm.#createEnemy(e);
    vm.#enemyHooks(e);

    vm.#battle.addEnemey(e.enemy);
  }

  #createEnemyLayout(index) {
    let vm = this;
    let e = {};

    e.div = document.createElement('div');
    e.plateDiv = document.createElement('div');
    e.enemyDiv = document.createElement('div');
    e.div.appendChild(e.enemyDiv);
    e.div.appendChild(e.plateDiv);
    e.id = `enemy_${index}`;

    e.plateDiv.style.paddingLeft = '6px';
    e.plateDiv.style.paddingRight = '6px';

    return e;
  }

  #createEnemy(e) {
    let vm = this;

    e.enemy = new Slime(
      vm.#gameLevel,
      vm.#battle
    );

    e.enemyDiv.classList.add(e.enemy.displayName);

    let l = vm.#mobLevel();
    while (e.enemy.level.level < l) {
      e.enemy.level.levelUp();
    }

    e.enemy.spendPoints();
    e.enemy.recover();

    e.plate = new Nameplate(e.plateDiv, e.enemy);
    e.plate.healthGauge.barWidth('100%');
    e.plate.hideLevel();
    e.plate.hideName();
    e.plate.hideMana();
    e.plate.update();

    e.enemy.id = e.id;
    e.enemy.div = e.div;
    e.details = new DetailSheet(e.enemy);

    vm.#party.each((a) => {
      a.enemies.forEach((v) => {
        v.party.add(e.enemy);
      });
      
      if (!a.enemies.includes(e.enemy)) {
        a.enemies.push(e.enemy);
      }
      
      if (!e.enemy.enemies.includes(a)) {
        e.enemy.enemies.push(a);
      }
    });

    e.enemyDiv.innerHTML = e.enemy.ascii;
    e.enemyDiv.classList.add('battle-enemy');
    e.plateDiv.classList.add('center');
  }

  #enemyHooks(e) {
    let vm = this;

    e.dblClick = () => {
      e.details.open(true);
    };

    e.beginCast = (n) => {
      e.enemyDiv.classList.add('battle-enemy-attack');
    };

    e.endRecoil = (n) => {
      e.enemyDiv.classList.remove('battle-enemy-attack');
    };

    e.damaged = (actor, dmg) => {
      e.enemyDiv.classList.add('battle-dmg');
      e.plate.update();
      setTimeout(() => {
        if (e && e.enemyDiv) {
          e.enemyDiv.classList.remove('battle-dmg');
        }
      }, 250);
    };

    e.death = (n) => {
      vm.#battle.removeEnemy(e.enemy);
      e.div.style.visibility = 'hidden';

      vm.#party.each((a) => {
        a.enemies.delete(e.enemy);
        if (a.attributes.hp > 0) {
          a.level.addXp(ActorLevel.monsterXp(e.enemy.level.level));
        }
      });
    };

    e.detailsClosing = () => {
      vm.#battle.battlefield.classList.remove('battle-hide');
      vm.#battle.infoPanel.classList.remove('battle-hide');
      vm.#battle.actionbars.classList.remove('battle-hide');

    };

    e.detailsOpening = () => {
      vm.#battle.battlefield.classList.add('battle-hide');
      vm.#battle.infoPanel.classList.add('battle-hide');
      vm.#battle.actionbars.classList.add('battle-hide');
    };

    e.battleClosing = () => {
      let vm = this;
      e.div.removeEventListener('dblclick', e.dblClick);
      e.details.ignoreEvent('opening', e.detailsOpening);
      e.details.ignoreEvent('closing', e.detailsClosing);
      e.enemy.ignoreEvent('begin cast', e.beginCast);
      e.enemy.ignoreEvent('end recoil', e.endRecoil);
      e.enemy.ignoreEvent('damaged', e.damaged);
      e.enemy.ignoreEvent('death', e.death);
      e.plate = undefined;
      e.div = undefined;
      e.enemyDiv = undefined;
      e.plateDiv = undefined;
      e.details = undefined;

      vm.#battle.ignoreEvent('closing', e.battleClosing);

      e = undefined;
    };

    e.div.addEventListener('dblclick', e.dblClick);
    e.details.listenToEvent('opening', e.detailsOpening);
    e.details.listenToEvent('closing', e.detailsClosing);
    e.enemy.listenToEvent('begin cast', e.beginCast);
    e.enemy.listenToEvent('end recoil', e.endRecoil);
    e.enemy.listenToEvent('damaged', e.damaged);
    e.enemy.listenToEvent('death', e.death);

    vm.#battle.listenToEvent('closing', e.battleClosing);
  }

}