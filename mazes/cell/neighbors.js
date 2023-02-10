import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js';

export class Neighbors extends EventHandler {

  items = new List();
  cell;

  saveState() {
    let vm = this;
    let r = {
      row: vm.cell.row,
      column: vm.cell.column,
      items: new List()
    };

    for (let i = 0; i < vm.items.length; i++) {
      r.items.push({
        row: vm.items[i].row,
        column: vm.items[i].column
      });
    }

    return r;
  }

  loadState(maze, state) {
    let vm = this;
    vm.cell = maze.cell(state.row, state.column);
    for (let i = 0; i < state.items.length; i++) {
      vm.items.push(maze.cell(
        state.items[i].row,
        state.items[i].column
      ));
    }
  }

  constructor(cell) {
    super();
    let vm = this;

    vm.cell = cell;
  }

  empty() {
    let vm = this;
    return vm.items.length === 0;
  }

  any() {
    let vm = this;
    return vm.items.length > 0;
  }

  unlinked() {
    let vm = this;
    let result = new List();
    for (let i = 0; i < vm.items.length; i++) {
      if (vm.items[i].links.empty()) {
        result.push(vm.items[i]);
      }
    }
    return result;
  }

  linked() {
    let vm = this;
    let result = new List();
    for (let i = 0; i < vm.items.length; i++) {
      if (vm.items[i].links.any()) {
        result.push(vm.items[i]);
      }
    }
    return result;
  }

  linkedTo(cell) {
    let vm = this;
    if (!cell) {
      cell = vm.cell;
    }

    let result = new List();
    for (let i = 0; i < vm.items.length; i++) {
      if (vm.items[i].links.items.includes(cell)) {
        result.push(vm.items[i]);
      }
    }
    return result;
  }

  notLinkedTo(cell) {
    let vm = this;
    if (!cell) {
      cell = vm.cell;
    }

    let result = new List();
    for (let i = 0; i < vm.items.length; i++) {
      if (!vm.items[i].links.items.includes(cell)) {
        result.push(vm.items[i]);
      }
    }
    return result;
  }

  deadends() {
    let vm = this;
    let result = new List();
    for (let i = 0; i < vm.items.length; i++) {
      if (vm.items[i].links.items.length === 1) {
        result.push(vm.items[i]);
      }
    }
    return result;
  }
}
