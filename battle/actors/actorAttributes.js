import { EventHandler } from '../../core/eventHandler.js'


export class ActorAttributes extends EventHandler {

  #actor;

  strength = 10;
  vitality = 20;
  intellect = 5;

  baseDamage = 3;
  baseHp = 10;
  baseMp = 10;

  hp;
  mp;

  available = 0;
  pointsPerLevel = 5;

  constructor(actor) {
    super();
    let vm = this;

    vm.defineEvent('changed');

    vm.#actor = actor;
    vm.#actor.level.listenToEvent('actor constructed', () => {
      actor.listenToEvent('leveled up', (e) => {
        e.actor.attribites.available += e.actor.attribites.pointsPerLevel;
      });
    });

    vm.hp = vm.maxHp;
    vm.mp = vm.maxMp;
  }

  get damageRange() {
    let vm = this;
    return `${vm.minDamage} - ${vm.maxDamage}`;
  }
  
  get health() {
    let vm = this;
    return `${vm.hp}/${vm.maxHp}`;
  }
  
  get mana() {
    let vm = this;
    return `${vm.mp}/${vm.maxMp}`;
  }
  
  get maxHp() {
    let vm = this;
    return vm.baseHp + (vm.vitality * 2);
  }

  get maxMp() {
    let vm = this;
    return vm.baseMp + (vm.intellect * 2);
  }

  get minDamage() {
    let vm = this;
    return vm.baseDamage + Math.floor(vm.strength / 6) + 1;
  }

  get maxDamage() {
    let vm = this;
    return vm.baseDamage + Math.ceil(vm.strength / 3) + 2
  }
}
