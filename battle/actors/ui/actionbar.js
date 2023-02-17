import { DOM } from '../../../core/dom.js';
import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'
import { Modal } from '../../../ui/modal/modal.js'

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

    DOM.stylesheet('./battle/actors/ui/actionbar.css', 'actionbar_styles')

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
      let btn = DOM.button(skill.displayName, vm.#bar, 'actionbar-btn');
      vm.#buttonHooks(btn, skill);
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
      btn.innerText = skill.displayName;
    };

    let done = () => {
      btn.classList.remove('actionbar-btn-active-' + skill.actor.name);
      btn.innerText = skill.displayName;
    };

    let update = () => {
      btn.innerText = skill.displayName;
      vm.#battle.partyInfo();
    };
    
    let release =() => {
      skill.ignoreEvent('updated', update);
      skill.ignoreEvent('end cast', update);
      skill.ignoreEvent('end recoil', done);
      skill.ignoreEvent('begin cast', begin);
      btn.removeEventListener('click', doClick);
      console.log('released skill ' + skill.name);
    }
    
    btn.addEventListener('click', doClick);
    skill.clearEvents();
    skill.listenToEvent('begin cast', begin);
    skill.listenToEvent('end recoil', done);
    skill.listenToEvent('updated', update);
    skill.listenToEvent('end cast', update);
  }


}
