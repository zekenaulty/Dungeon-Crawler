import { EventHandler } from '../../core/eventHandler.js'


export class ActorAttributes extends EventHandler {

  #actor;

  strength = 5;
  vitality = 5;
  intellect = 0;

  baseDamage = 3;
  baseHp = 10;
  baseMp = 0;

  /* 
    these are used for bonuses applied 
    from leveling. Not saved recalculated.
    
    non-calculated rewards should applied 
    to actual base and save called
  */
  baseDamageLevel = 0;
  baseHpLevel = 0;
  baseMpLevel = 0;
  
  hp;
  mp;

  available = 0;
  pointsPerLevel = 10;

  constructor(actor) {
    super();
    let vm = this;

    vm.defineEvent('changed');

    vm.#actor = actor;

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
    return vm.baseHp + vm.baseHpLevel + (vm.vitality * 2);
  }

  get maxMp() {
    let vm = this;
    return vm.baseMp + vm.baseMpLevel + (vm.intellect * 2);
  }

  get minDamage() {
    let vm = this;
    return Math.floor((vm.baseDamage + vm.baseDamageLevel )/ 6 + 1) + Math.floor(vm.strength / 6) + 1;
  }

  get maxDamage() {
    let vm = this;
    return vm.baseDamage + vm.baseDamageLevel + Math.ceil(vm.strength / 3) + 3
  }
}
