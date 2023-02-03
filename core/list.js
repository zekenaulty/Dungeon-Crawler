export class List extends Array {

  constructor() {
    super();
  }

  sample() {
    if (this.length === 1) return this[0];
    if (this.length === 0) return undefined;

    return this[Math.floor(Math.random() * this.length)];
  }

  delete(item) {
    if (this.length === 0) return;
    let idx = this.indexOf(item);
    if (idx < 0) return;
    this.splice(idx, 1);
  }
}
