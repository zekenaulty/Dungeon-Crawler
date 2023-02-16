import { List } from '../../core/list.js';
import { Modal } from '../../ui/modal/modal.js'
import { SaveData } from '../saveData.js';

export class Saves extends Modal {

  #gameLevel;
  #stylesheet;
  #slotView;

  constructor(game) {
    super();

    let vm = this;

    vm.#gameLevel = game;

    if (!document.getElementById('saves-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'saves-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/ui/saves.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#saves-styles');
    }

    vm.#slotView = document.createElement('div');
    vm.#slotView.classList.add('saves-view');

    let row = document.createElement('div');
    let newSave = document.createElement('button');
    let newGame = document.createElement('button');

    row.classList.add('saves-controls');
    newSave.classList.add('saves-create');
    newGame.classList.add('saves-new-game');

    newSave.innerHTML = 'new save';
    newGame.innerHTML = 'new game';
    row.appendChild(newSave);
    row.appendChild(newGame);

    newSave.addEventListener('click', () => {
      let current = SaveData.getSlots();
      if (current && Array.isArray(current) && current.length > 5) {
        return;
      }
      let d = new Date();
      let s = `<span>${d.toLocaleDateString()}</span><span>${d.toLocaleTimeString()}</span>`;

      SaveData.save(vm.#gameLevel, s);
      vm.showSlot(s);
    });

    newGame.addEventListener('click', () => {
      vm.close();
      vm.#gameLevel.begin(true);
    });

    vm.listenToEvent('opening', () => {
      let current = SaveData.getSlots();
      vm.#slotView.innerHTML = '';

      if (!current || !Array.isArray(current) || current.length < 1) {
        return;
      }

      for (let i = 0; i < current.length; i++) {
        vm.showSlot(current[i]);
      }
    });

    vm.appendChild(row);
    vm.appendChild(vm.#slotView);
  }


  showSlot(slot) {
    let vm = this;
    let data = SaveData.getState(slot);
    if (!data) {
      return;
    }

    let e = document.createElement('div');
    e.classList.add('save-slot');

    let h = document.createElement('div');
    h.classList.add('save-header');
    let t = (slot == 'auto') ? '<span>auto</span><span>save</span>' : slot;
    h.innerHTML = t.toUpperCase();
    e.appendChild(h);

    let about = document.createElement('div');
    about.classList.add('save-about');
    about.innerHTML = data.summary;
    e.appendChild(about);

    let buttons = document.createElement('div');
    buttons.classList.add('save-buttons');
    e.appendChild(buttons);

    let load = document.createElement('button');
    let del = document.createElement('button');
    load.classList.add('saves-load');
    del.classList.add('saves-del');

    load.innerHTML = 'load';
    del.innerHTML = 'delete';

    load.addEventListener('click', () => {
      vm.close();
      SaveData.load(vm.#gameLevel, slot);
    });

    del.addEventListener('click', () => {
      SaveData.remove(slot);
      vm.#slotView.removeChild(e);
    });

    buttons.appendChild(load);
    buttons.appendChild(del);

    vm.#slotView.appendChild(e);

  }
}
