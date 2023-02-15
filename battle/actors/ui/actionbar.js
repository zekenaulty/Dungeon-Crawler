import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'
import { Modal } from '../../../layout/modal/modal.js'

export class Actionbar extends EventHandler {

  #stylesheet;
  #actor;
  #battle;
  #bar;

  constructor(bar, actor, battle) {
    super();

    let vm = this;

    vm.#actor = actor;
    vm.#bar = bar;
    vm.#battle = battle;

    if (!document.getElementById('actionbar-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'actionbar-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/actors/ui/actionbar.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#actionbar-styles');
    }

  }

  populate() {
    let vm = this;
    for (let k in vm.#actor.skills) {
      let skill = vm.#actor.skills[k];
      vm.#addButton(skill);
    }
  }

  #addButton(skill) {
    let vm = this;
    if (skill.register && !skill.availableOutOfCombatOnly) {
      let btn = document.createElement('button');
      btn.innerHTML = skill.displayName;
      btn.classList.add('actionbar-btn');
      vm.#buttonHooks(btn, skill);
      vm.#bar.appendChild(btn);
    }
  }

  #buttonHooks(btn, skill) {
    let vm = this;
    
    let doClick = () => {
      if (!vm.#battle || vm.#battle.paused || Modal.openCount > 1) {
        return;
      }
      skill.invoke();
    };

    let begin = () => {
      btn.classList.add('actionbar-btn-active-' + skill.actor.name);
      btn.innerHTML = skill.displayName;
    };

    let done = () => {
      btn.classList.remove('actionbar-btn-active-' + skill.actor.name);
      btn.innerHTML = skill.displayName;
    };

    let update = () => {
      vm.#battle.partyInfo();
    };
    
    let release =() => {
      skill.ignoreEvent('updated', update);
      skill.ignoreEvent('end cast', update);
      skill.ignoreEvent('end recoil', done);
      skill.ignoreEvent('begin cast', begin);
      vm.#battle.ignoreEvent('closing', release);
      btn.removeEventListener('click', doClick);
    }
    
    btn.addEventListener('click', doClick);
    skill.listenToEvent('begin cast', begin);
    skill.listenToEvent('end recoil', done);
    skill.listenToEvent('updated', update);
    skill.listenToEvent('end cast', update);
    vm.#battle.listenToEvent('closing', release);
  }


}
