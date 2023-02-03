
import { List } from '../core/list.js';

export class Distance extends List {
  root = undefined;
  distances = {};

  constructor(start) {

    super();

    this.root = start;
    this.distances[this.root.key] = 0;
    this.push(this.root)

  }

  collect(cell, distance) {
    this.distances[cell.key] = distance;
    this.push(cell);
  }

  distance(cell) {
    return this.distances[cell.key];
  }

  pathTo(cell) {
    let current = cell;
    let breadcrumbs = new Distance(this.root);
    while (current !== this.root) {
      for (let i = 0; i < current.links.length; i++) {
        let neighbor = current.links[i];
        if (this.distance(neighbor) < this.distance(current)) {
          breadcrumbs.collect(neighbor, this.distance(neighbor));
          current = neighbor;
          break;
        }
      }
    }
    return breadcrumbs;
  }

  max() {
    let maxDistance = 0;
    let maxCell = this.root;
    for (let i = 0; i < this.length; i++) {
      let c = this[i];
      let d = this.distance(c);
      if (d > maxDistance) {
        maxCell = c;
        maxDistance = d;
      }
    }

    return {
      cell: maxCell,
      distance: maxDistance
    };
  }
}
