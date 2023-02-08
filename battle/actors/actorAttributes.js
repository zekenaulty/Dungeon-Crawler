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

    let self = this;
    
    this.defineEvent('changed');

    this.#actor = actor;
    this.#actor.listenToEvent('constructed', () => {
      actor.listenToEvent('leveled up', () => {
        self.available += self.pointsPerLevel;
      });
    });

    this.hp = this.maxHp;
    this.mp = this.maxMp;
  }

  get damageRange() {
    return `${this.minDamage} - ${this.maxDamage}`;
  }
  
  get health() {
    return `${this.hp}/${this.maxHp}`;
  }
  
  get mana() {
    return `${this.mp}/${this.maxMp}`;
  }
  
  get maxHp() {
    return this.baseHp + (this.vitality * 2);
  }

  get maxMp() {
    return this.baseMp + (this.intellect * 2);
  }

  get minDamage() {
    return this.baseDamage + Math.floor(this.strength / 6) + 1;
  }

  get maxDamage() {
    return this.baseDamage + Math.ceil(this.strength / 3) + 2
  }
} /* end ActorAttributes */
