import { List } from '../../../core/list.js';
import { Modal } from '../../../layout/modal/modal.js'

export class DetailSheet extends Modal {

  #stylesheet;
  #actor;
  #editable = false;
  #container;
  #skills;
  #elements = new List();

  constructor(actor, editable) {
    super();

    this.#actor = actor;
    this.#editable = editable;

    if (!document.getElementById('detail-sheet-styles')) {
      this.#stylesheet = document.createElement('link');
      this.#stylesheet.id = 'detail-sheet-styles';
      this.#stylesheet.rel = 'stylesheet';
      this.#stylesheet.href = './battle/actors/ui/detailSheet.css';
      document.querySelector('head').appendChild(this.#stylesheet);
    } else {
      this.#stylesheet = document.querySelector('#detail-sheet-styles');
    }

    this.#container = document.createElement('div');
    this.#container.classList.add('detail-sheet-content');
    this.appendChild(this.#container);

    this.#add('Name', this.#actor, 'name');
    this.#add('Level', this.#actor.level, 'level');
    this.#add('XP', this.#actor.level, 'requiredXp');
    this.#spacer();
    this.#add('Health', this.#actor.attributes, 'health');
    this.#add('Mana', this.#actor.attributes, 'mana');
    this.#add('Damage', this.#actor.attributes, 'damageRange');
    this.#spacer();
    this.#add('Available Points', this.#actor.attributes, 'available');
    this.#spacer();
    this.#add('Vitality', this.#actor.attributes, 'vitality', true);
    this.#add('Strength', this.#actor.attributes, 'strength', true);
    this.#add('Intellect', this.#actor.attributes, 'intellect', true);
    this.#spacer();

    this.#text('Skills');
    this.#skills = document.createElement('div');
    this.#skills.classList.add('detail-sheet-skills');
    this.#container.appendChild(this.#skills);
    for (let p in this.#actor.skills) {
      let skill = this.#actor.skills[p];
      if (skill.register) {
        this.#addSkill(skill);
      }
    }

    let self = this;
    this.listenToEvent('opening', () => {
      self.update();
    });

  }

  #addSkill(skill) {
    let e = {
      element: document.createElement('span'),
      update: () => {
        e.element.innerHTML = `${skill.name} (${skill.cooldown/1000}s cd): <span class="detail-sheet-attribute-text-tiny">${skill.summary}</span>`;
      }
    };

    e.update();
    e.element.classList.add('detail-sheet-attribute-bold');
    this.#elements.push(e);
    this.#skills.appendChild(e.element);
  }

  #add(label, scope, key, editableAttribute = false, target) {
    if (!target) {
      target = this.#container;
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
        if (this.#actor.attributes.available > 0) {
          this.#actor.attributes.available--;
          scope[key]++;
          this.#actor.attributes.raiseEvent('changed');
        }
        this.update();
      });
    }

    this.#elements.push(e);
    target.appendChild(e.row);

  }

  #spacer(target) {
    if (!target) {
      target = this.#container;
    }

    let row = document.createElement('div');
    row.innerHTML = '&nbsp;';
    target.appendChild(row);
  }

  #text(t, target, bold = true) {
    if (!target) {
      target = this.#container;
    }
    let txt = document.createElement('span');
    txt.innerHTML = t;
    txt.classList.add(bold ? 'detail-sheet-attribute-bold' : 'detail-sheet-attribute-text');
    target.appendChild(txt);
  }

  update() {
    for (let i = 0; i < this.#elements.length; i++) {
      this.#elements[i].update();
    }
  }
}
