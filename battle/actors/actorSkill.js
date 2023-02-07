import { EventHandler } from '../../core/eventHandler.js'

export class ActorSkill extends EventHandler {
  actor;
  cooldown = 1500;
  lastUsed = 0;
  minBy = 0;
  maxBy = 0;
  lock = false;
  register = false;
  name = 'base skill';
  
  get summary() {
    return '';
  }


  get now() {
    return new Date().getTime();
  }

  get onCd() {
    return this.now - this.lastUsed < this.cooldown;
  }

  get onGcd() {
    if (!this.actor.skills['GCD']) {
      return false;
    }
    return this.actor.skills['GCD'].onCd;
  }

  gcd() {
    if (!this.actor.skills['GCD']) {
      return;
    }
    this.actor.skills['GCD'].invoke();
  }

  constructor(actor) {
    super();

    this.actor = actor;

    this.resetCooldown;

  }


  doAttack(target) {
    let maxDmg = this.actor.attributes.maxDamage + this.maxBy;
    let minDmg = this.actor.attributes.minDamage + this.minBy;
    let dmg = Math.ceil(Math.random() * maxDmg) + 1;
    if (dmg < minDmg) {
      dmg = minDmg + 1;
    } else if (dmg > maxDmg) {
      dmg = maxDmg;
    }

    //TODO use dex for crit and dodge
    //TODO add chance to miss

    target.takeDamage(dmg);
  }

  invoke() {

  }

  resetCooldown() {
    this.lastUsed = this.now - this.cooldown;
  }

  refresh() {}

  safeInvoke(action) {
    if (this.lock || this.onGcd) {
      return;
    }

    this.lock = true;
    if (!this.onCd && this.actor.attributes.hp >= 1) {
      action();
      this.lastUsed = this.now;
    }
    this.lock = false;

  }

}
