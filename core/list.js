export class List extends Array {

  constructor() {
    super();
  }

  sample() {
    let vm = this;
    if (vm.length === 1) return vm[0];
    if (vm.length === 0) return undefined;

    return vm[Math.floor(Math.random() * vm.length)];
  }

  delete(item) {
    let vm = this;
    if (vm.length === 0) return;
    let idx = vm.indexOf(item);
    if (idx < 0) return;
    vm.splice(idx, 1);
  }
  
  empty() {
    let vm = this;
    return vm.length === 0;
  }
  
  any() {
    let vm = this;
    return vm.length > 0;
  }
}
