import { List } from '../../core/list.js';
import { Modal } from '../../layout/modal/modal.js'
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

  #gameLevel;
  #paused = true;
  #endGrind;

  #nameplates;
  #actionbars;

  #party;

  #open = false;

  #partyDamaged;
  #partyDeath;
  #closing;
  #opening;
  
  #spawner;

  constructor(party, gameLevel) {
    super();
    let vm = this;

    vm.#party = party;
    vm.#gameLevel = gameLevel;
    vm.#paused = true;
    vm.#spawner = new Spawner(vm.#party, vm.#gameLevel, vm);

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
    vm.#actions = document.createElement('div');

    vm.#battlefield.classList.add('battle-battlefield');
    vm.#partyInfo.classList.add('battle-party-info');
    vm.#actions.classList.add('battle-pc-actions');

    vm.#registerParty();

    vm.partyInfo();

    vm.appendChild(vm.#battlefield);
    vm.appendChild(vm.#partyInfo);
    vm.appendChild(vm.#actions);

    vm.#createPauseButton();
    vm.#createGrindButton();

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
        500
      );
    };
    
    vm.#closing = () => {
      vm.ignoreEvent('opening', vm.#opening);
      vm.ignoreEvent('closing', vm.#closing);
      vm.#party.each((a) => {
        a.ignoreEvent('damaged', vm.#partyDamaged);
        a.ignoreEvent('death', vm.#partyDeath);
        a.battle = undefined;
      });
    };

    vm.listenToEvent('opening', vm.#opening);
    vm.listenToEvent('closing', vm.#closing);

  }

  get isOpen() {
    let vm = this;
    return vm.#open;
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
  
  get actonbars() {
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
      
      let ab = document.createElement('div');
      
      ab.classList.add('battle-actionbar');
      ab.bar = new Actionbar(ab, a, vm);
      ab.bar.populate();
      vm.#actionbars.push(ab);
      vm.#actions.appendChild(ab);
    });

  }

  #createPauseButton() {
    let vm = this;
    vm.#pauseBtn = document.createElement('button');
    vm.#pauseBtn.innerHTML = 'pause';
    vm.#pauseBtn.classList.add('battle-btn');
    vm.#pauseBtn.classList.add('battle-pause');

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

    vm.appendChild(vm.#pauseBtn);
  }

  #createGrindButton() {
    let vm = this;
    if (vm.#gameLevel.grinding) {
      vm.#endGrind = document.createElement('button');
      vm.#endGrind.innerHTML = 'stop waves';
      vm.#endGrind.classList.add('battle-end-grind');
      vm.#endGrind.classList.add('battle-green');

      vm.appendChild(vm.#endGrind);

      vm.#endGrind.addEventListener('click', () => {
        if (vm.#gameLevel.grinding) {
          vm.#gameLevel.stopGrind();
          vm.#endGrind.innerHTML = 'fight waves';
          vm.#endGrind.classList.remove('battle-green');
        } else {
          vm.#gameLevel.startGrind();
          vm.#endGrind.innerHTML = 'stop waves';
          vm.#endGrind.classList.add('battle-green');
        }
      });
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
    vm.#battlefield.appendChild(e);
  }

  removeEnemy(e) {
    let vm = this;
    e.stopAi();
    e.enemies.forEach((a) => {
      a.enemies.delete(a);
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
      if(a.autoBattle) {
        a.startAi();
      }
      h = a;
    });
    
    if(h) {
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
      if(a.autoBattle) {
        a.stopAi();
      }
      h = a;
    });
    
    if(h) {
      h.enemies.forEach((e) => {
        e.stopAi();
      });
    }
  }

}
