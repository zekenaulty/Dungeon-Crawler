
import { List } from '../core/list.js';

export class Distance {
  root;
  distances = {};
  items = new List();

  constructor(start) {

    this.root = start;
    this.distances[this.root.key] = 0;
    this.items.push(this.root)

  }

  collect(cell, distance) {
    this.distances[cell.key] = distance;
    this.items.push(cell);
  }

  distance(cell) {
    return this.distances[cell.key];
  }

  pathTo(cell) {
    let current = cell;
    let breadcrumbs = new Distance(this.root);
    while (current !== this.root) {
      for (let i = 0; i < current.links.items.length; i++) {
        let neighbor = current.links.items[i];
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
    for (let i = 0; i < this.items.length; i++) {
      let c = this.items[i];
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
