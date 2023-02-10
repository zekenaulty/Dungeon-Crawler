import { List } from '../../../core/list.js';
import { Modal } from '../../../layout/modal/modal.js'

export class DetailSheet extends Modal {

  #stylesheet;
  #actor;
  #editable = false;
  #container;
  #skills;
  #elements = new List();

  constructor(actor, editable = false) {
    super();
    let vm = this;

    vm.#actor = actor;
    vm.#editable = editable;

    if (!document.getElementById('detail-sheet-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'detail-sheet-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/actors/ui/detailSheet.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#detail-sheet-styles');
    }

    vm.#container = document.createElement('div');
    vm.#container.classList.add('detail-sheet-content');
    vm.appendChild(vm.#container);

    vm.#add('Name', vm.#actor, 'name');
    vm.#add('Level', vm.#actor.level, 'level');
    vm.#add('XP', vm.#actor.level, 'xpRequired');
    vm.#spacer();
    vm.#add('Health', vm.#actor.attributes, 'health');
    vm.#add('Mana', vm.#actor.attributes, 'mana');
    vm.#add('Damage', vm.#actor.attributes, 'damageRange');
    vm.#spacer();
    vm.#add('Available Points', vm.#actor.attributes, 'available');
    vm.#spacer();
    vm.#add('Vitality', vm.#actor.attributes, 'vitality', true && editable);
    vm.#add('Strength', vm.#actor.attributes, 'strength', true && editable);
    vm.#add('Intellect', vm.#actor.attributes, 'intellect', true && editable);
    vm.#spacer();

    vm.#text('Skills <span class="tiny-text">(☆ castable)</span>');
    vm.#skills = document.createElement('div');
    vm.#skills.classList.add('detail-sheet-skills');
    vm.#container.appendChild(vm.#skills);
    for (let p in vm.#actor.skills) {
      let skill = vm.#actor.skills[p];
      if (skill.register) {
        vm.#addSkill(skill);
      }
    }

    vm.listenToEvent('opening', (e) => {
      e.modal.update();
    });

    vm.listenToEvent('closed', (e) => {
      vm.#actor.gameLevel.raiseEvent('updated', vm.#actor.gameLevel);
    });
  }

  #addSkill(skill) {
    let vm = this;
    let e = {
      element: document.createElement('span'),
      update: () => {
        let castable = skill.availableOutOfCombat ? '☆ ' : '';
        let mp = skill.mpCost > 0 ? `, ${skill.mpCost}mp` : ``;
        e.element.innerHTML = `<span class="bold">${castable}${skill.name} (${skill.cooldown/1000}s cd${mp}): </span><span>${skill.summary}</span>`;
      }
    };

    if (skill.availableOutOfCombat && vm.#editable) {
      e.element.addEventListener('click', () => {
        e.element.classList.add('detail-sheet-skill-active');
        let clear = () => {
          e.element.classList.remove('detail-sheet-skill-active');
          vm.update();
          skill.ignoreEvent('end recoil', clear);
        };
        skill.listenToEvent('end recoil', clear);
        skill.invoke();
      });
    }

    e.update();
    e.element.classList.add('detail-sheet-skill');
    vm.#elements.push(e);
    vm.#skills.appendChild(e.element);
  }

  #add(label, scope, key, editableAttribute = false, target) {
    let vm = this;
    if (!target) {
      target = vm.#container;
    }

    let e = {
      row: document.createElement('div'),
      infoGroup: document.createElement('span'),
      label: document.createElement('span'),
      value: document.createElement('span'),
      button: editableAttribute ? document.createElement('button') : undefined,
      update: () => {
        e.label.innerHTML = `${label}:&nbsp;`;
        e.value.innerHTML = `${scope[key]}`;
      }
    };

    e.row.classList.add('detail-sheet-attribute-row');
    e.infoGroup.classList.add('detail-sheet-attribute-group');
    e.label.classList.add('detail-sheet-attribute-bold');
    e.value.classList.add('detail-sheet-attribute-text');

    e.infoGroup.appendChild(e.label);
    e.infoGroup.appendChild(e.value);
    e.row.appendChild(e.infoGroup);
    if (editableAttribute) {
      e.button.classList.add('detail-sheet-attribute-button');
      e.button.innerHTML = '+';
      e.row.appendChild(e.button);
      e.button.addEventListener('click', () => {
        if (vm.#actor.attributes.available > 0) {
          vm.#actor.attributes.available--;
          scope[key]++;
          vm.#actor.attributes.raiseEvent(
            'changed',
            {
              sheet: vm,
              actor: vm.#actor
            });
        }
        vm.update();
      });
    }

    vm.#elements.push(e);
    target.appendChild(e.row);

  }

  #spacer(target) {
    let vm = this;
    if (!target) {
      target = vm.#container;
    }

    let row = document.createElement('div');
    row.innerHTML = '&nbsp;';
    target.appendChild(row);
  }

  #text(t, target, bold = true) {
    let vm = this;
    if (!target) {
      target = vm.#container;
    }
    let txt = document.createElement('span');
    txt.innerHTML = t;
    txt.classList.add(bold ? 'detail-sheet-attribute-bold' : 'detail-sheet-attribute-text');
    target.appendChild(txt);
  }

  update() {
    let vm = this;
    for (let i = 0; i < vm.#elements.length; i++) {
      vm.#elements[i].update();
    }
  }
}
