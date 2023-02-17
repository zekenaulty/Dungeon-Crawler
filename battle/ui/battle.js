import { DOM } from '../../core/dom.js';
import { List } from '../../core/list.js';
import { Modal } from '../../ui/modal/modal.js'
import { Dice } from '../dice.js';
import { Slime } from '../actors/enemies/slime.js';
import { ActorLevel } from '../actors/actorLevel.js';
import { ActorInventory } from '../actors/actorInventory.js';
import { DetailSheet } from '../actors/ui/detailSheet.js';
import { SaveData } from '../saveData.js';
import { Nameplate } from '../actors/ui/nameplate.js';
import { Spawner } from './spawner.js';
import { Actionbar } from '../actors/ui/actionbar.js'

export class Battle extends Modal {

  #stylesheet;
  #battlefield;
  #partyInfo;
  #actions;
  #pauseBtn;
  #autoBattleBtn;

  #gameLevel;
  #paused = true;
  #fightWavesBtn;

  #nameplates;
  #actionbars;

  #party;

  #partyDamaged;
  #partyDeath;
  #enemyDeath;
  #closed;
  #opening;

  #spawner;

  constructor(party, gameLevel) {
    super();
    let vm = this;

    vm.#party = party;
    vm.#gameLevel = gameLevel;
    vm.#paused = true;
    vm.#spawner = new Spawner(vm.#party, vm.#gameLevel, vm);

    DOM.stylesheet('./battle/ui/battle.css', 'battle_styles');

    vm.#battlefield = DOM.div(vm.content, 'battle-battlefield');
    vm.#partyInfo = DOM.div(vm.content, 'battle-party-info');
    vm.#actions = DOM.div(vm.content, 'battle-pc-actions');

    vm.#registerParty();
    vm.partyInfo();

    vm.#createPauseButton();
    vm.#createFightWavesButton();
    vm.#createAutoBattleButton();

    vm.defineEvent(
      'begin combat',
      'end combat',
      'won battle'
    );

    vm.#opening = () => {
      vm.#spawner.spawn();
      setTimeout(() => {
          vm.#paused = false;
          vm.raiseEvent(
            'begin combat',
            {
              battle: vm,
              level: vm.#gameLevel
            });

          vm.startAi();
        },
        10
      );
    };

    vm.#closed = () => {
      vm.ignoreEvent('opening', vm.#opening);
      vm.ignoreEvent('closed', vm.#closed);
      vm.#party.each((a) => {
        a.ignoreEvent('damaged', vm.#partyDamaged);
        a.ignoreEvent('death', vm.#partyDeath);
        a.battle = undefined;
      });
    };

    vm.#enemyDeath = (e) => {
      e.ignoreEvent('death', vm.#enemyDeath);
      if (e.party.dead()) {
        vm.stopAi();
        vm.raiseEvent('end combat', vm);
        vm.raiseEvent('won battle', vm);
      }
    };

    vm.listenToEvent('opening', vm.#opening);
    vm.listenToEvent('closed', vm.#closed);

  }

  get paused() {
    let vm = this;
    return vm.#paused;
  }

  get battlefield() {
    let vm = this;
    return vm.#battlefield;
  }

  get infoPanel() {
    let vm = this;
    return vm.#partyInfo;
  }

  get actionbars() {
    let vm = this;
    return vm.#actions;
  }

  #registerParty() {
    let vm = this;

    vm.#actionbars = new List();

    vm.#partyDamaged = () => {
      vm.partyInfo();
    };

    vm.#partyDeath = () => {
      if (vm.#party.dead()) {
        vm.stopAi();
        vm.raiseEvent('end combat', vm);
        vm.#gameLevel.gameOver();
        vm.close();
      }
    };

    vm.#party.each((a) => {
      if (!vm.#nameplates) {
        vm.#nameplates = new List();
      }
      vm.#nameplates.push(new Nameplate(vm.#partyInfo, a));
      a.listenToEvent('damaged', vm.#partyDamaged);
      a.listenToEvent('death', vm.#partyDeath);
      a.battle = vm;

      let ab = DOM.div(vm.#actions, 'actionbar');
      ab.bar = new Actionbar(ab, a, vm);
      ab.bar.populate();
      vm.#actionbars.push(ab);
    });

  }

  #createPauseButton() {
    let vm = this;
    vm.#pauseBtn = DOM.button(
      'pause',
      vm.content,
      ['battle-btn', 'battle-pause'],
      () => {
        if (vm.#paused) {
          vm.#paused = false;
          vm.#pauseBtn.classList.remove('battle-green');
        } else {
          vm.#pauseBtn.classList.add('battle-green');
          vm.#paused = true;
        }
      }
    );
  }

  #createAutoBattleButton() {
    let vm = this;
    vm.#autoBattleBtn = DOM.button(
      'auto battle',
      vm.content,
      ['battle-btn', 'battle-auto-battle'],
      () => {
        if (vm.#party.first().autoBattle) {
          vm.#autoBattleBtn.classList.remove('battle-green');
          vm.#party.each((a) => {
            a.autoBattle = false;
            a.stopAi();
          });
        } else {
          vm.#autoBattleBtn.classList.add('battle-green');
          vm.#party.each((a) => {
            a.autoBattle = true;
            a.startAi();
          });
        }
      }
    );

    if (vm.#party.first().autoBattle) {
      vm.#autoBattleBtn.classList.add('battle-green');
    }
  }

  #createFightWavesButton() {
    let vm = this;
    if (vm.#gameLevel.fight.running && !vm.#gameLevel.fight.encounter) {
      vm.#fightWavesBtn = DOM.button(
        'waves',
        vm.content,
        ['battle-end-grind', 'battle-green'],
        () => {
          if (vm.#gameLevel.fight.running) {
            vm.#gameLevel.fight.stop();
            vm.#fightWavesBtn.classList.remove('battle-green');
          } else {
            vm.#gameLevel.fight.start();
            vm.#fightWavesBtn.classList.add('battle-green');
          }
        }
      );
    }
  }

  partyInfo() {
    let vm = this;
    vm.#nameplates.forEach((n) => {
      n.update();
    });
  }

  addEnemey(e) {
    let vm = this;
    e.listenToEvent('death', vm.#enemyDeath);
    vm.#battlefield.appendChild(e.div);
  }

  removeEnemy(e) {
    let vm = this;
    e.stopAi();
    vm.#party.each((a) => {
      e.enemies.delete(a);
      a.enemies.delete(e);
    });
  }

  clearEnemies() {
    let vm = this;
    vm.#paused = true;
    let h = vm.#party.first();
    h.enemies.forEach((e) => {
      vm.removeEnemy(e);
    });
  }

  startAi() {
    let vm = this;
    vm.#paused = false;
    let h;
    vm.#party.each((a) => {
      if (a.autoBattle) {
        a.startAi();
      }
      h = a;
    });

    if (h) {
      h.enemies.forEach((e) => {
        e.startAi();
      });
    }
  }

  stopAi() {
    let vm = this;
    vm.#paused = true;
    let h;
    vm.#party.each((a) => {
      if (a.autoBattle) {
        a.stopAi();
      }
      h = a;
    });

    if (h) {
      h.enemies.forEach((e) => {
        e.stopAi();
      });
    }
  }

  pause() {
    let vm = this;
    vm.#paused = !vm.paused;
    if (vm.#paused) {
      vm.#pauseBtn.classList.add('battle-green');
    } else {
      vm.#pauseBtn.classList.remove('battle-green');
    }
  }

}
