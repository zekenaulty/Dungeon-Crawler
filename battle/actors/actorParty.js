import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'

export class ActorParty extends EventHandler {
  
  #members;
  #actor;
  
  constructor(actor) {
    super();
    
    let vm = this;
    
    vm.#actor = actor;
    vm.#members = new List();
    vm.#members.push(vm.#actor);
    
    //maybe
    vm.defineEvent(
      'death',
      'damaged',
      'healed',
      'levwled up'
      );
    
  }
  
  add(actor) {
    let vm = this;
    
    vm.#members.push(actor)
  }
  
  remove(actor) {
    let vm = this;
    
    vm.#members.delete(actor);
  }
  
  lowHealth(p = 0.65) {
    let vm = this;
    
    if(!vm.#members || vm.#members.length < 1) {
      return false;
    }
    
    let c = 0;
    vm.#members.forEach((e) => {
      if(e.lowHealth(p)) {
        c++;
      }
    });
    
    if(c === 0) {
      return false;
    }
    
    if(c === vm.#members.length) {
      return true;
    }
    
    let n = Math.floor(vm.#members.length * 0.4);
    if(c >= n) {
      return true;
    }
  }
  
  lowestHealthMember() {
    let vm = this;
    
    if(!vm.#members || vm.#members.length < 1) {
      return;
    }
    
    let a = vm.#members[0];
    for(let i = 1; i < vm.#members.length; i++) {
      let b = vm.#members[i];
      let ap = a.attributes.hp / a.attributes.maxHp * 100;
      let bp = b.attributes.hp / b.attributes.maxHp * 100;
      console.log(a.name + ' ' + ap);
      console.log(b.name + ' ' + bp);
      if(bp < ap) {
        a = b;
      }
    }
    
    return a;
  }
  
  autoBattle() {
    let vm = this;
    
    vm.#members.forEach((e) => {
      e.autoBattle = true;
    });
  }
  
  each(action) {
    if(!action) {
      return;
    }
    
    let vm = this;
    vm.#members.forEach((e) => {
      action(e);
    });
  }

  first() {
    let vm = this;
    return vm.#members[0];
  }
  
  last() {
    let vm = this;
    return vm.#members[vm.#members.length - 1];
  }
  
  random() {
    let vm = this;
    return vm.#members.sample();
  } 
}
