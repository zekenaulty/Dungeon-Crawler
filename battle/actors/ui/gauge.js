import { List } from '../../../core/list.js';
import { EventHandler } from '../../../core/eventHandler.js'

export class Gauge extends EventHandler {

  #stylesheet;
  #max;

  #box;
  #outer;
  #fill;
  #barText;
  #label;

  constructor(
    container,
    max,
    val = -1,
    barText = '&nbsp;',
    labelText = '') {
    super();

    let vm = this;

    vm.#max = max;
    if (val == -1) {
      val = max;
    }

    if (!document.getElementById('gauge-styles')) {
      vm.#stylesheet = document.createElement('link');
      vm.#stylesheet.id = 'gauge-styles';
      vm.#stylesheet.rel = 'stylesheet';
      vm.#stylesheet.href = './battle/actors/ui/gauge.css';
      document.querySelector('head').appendChild(vm.#stylesheet);
    } else {
      vm.#stylesheet = document.querySelector('#gauge-styles');
    }

    vm.#box = document.createElement('span');
    vm.#label = document.createElement('span');
    vm.#outer = document.createElement('span');
    vm.#fill = document.createElement('span');
    vm.#barText = document.createElement('span');

    vm.#box.classList.add('gauge-box');
    vm.#label.classList.add('gauge-label');
    vm.#outer.classList.add('gauge-outer');
    vm.#fill.classList.add('gauge-fill');
    vm.#barText.classList.add('gauge-text');

    vm.#outer.appendChild(vm.#fill);
    vm.#outer.appendChild(vm.#barText);
    vm.#box.appendChild(vm.#label);
    vm.#box.appendChild(vm.#outer);

    vm.#fill.innerHTML = '&nbsp;';

    vm.update(val);
    vm.barText(barText);
    vm.labelText(labelText);

    container.appendChild(vm.#box);
  }

  update(val) {
    let vm = this;
    let p = vm.#percent(val);

    vm.#fill.style.width = p + '%';

    return p;
  }

  #percent(val) {
    let vm = this;
    return Math.floor(val / vm.#max * 100);
  }


  labelText(t) {
    let vm = this;
    if (t) {
      vm.#label.innerHTML = t;
    }
    return vm.#label.innerHTML;
  }

  barText(t) {
    let vm = this;
    if (t) {
      vm.#barText.innerHTML = t;
    }
    return vm.#barText.innerHTML;
  }

  width(v) {
    let vm = this;
    if (v) {
      vm.#box.style.width = v;
    }

    return vm.#box.style.width;
  }

  textColor(v) {
    let vm = this;
    if (v) {
      vm.#barText.style.color = v;
    }

    return vm.#barText.style.color;
  }

  backgroundColor(v) {
    let vm = this;
    if (v) {
      vm.#box.style.backgroundColor = v;
    }

    return vm.#box.style.backgroundColor;
  }

  fillColor(v) {
    let vm = this;
    if (v) {
      vm.#fill.style.backgroundColor = v;
    }

    return vm.#fill.style.backgroundColor;
  }
}
