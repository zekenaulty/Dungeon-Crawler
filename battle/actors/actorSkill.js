import { EventHandler } from '../../core/eventHandler.js'

export class ActorSkill extends EventHandler {
  actor;
  castTime = 250;
  recoilTime = 250;
  cooldown = 1500;
  lastUsed = 0;
  minBy = 0;
  maxBy = 0;
  lock = false;
  register = false;
  name = 'base skill';
  castId;
  recoilId;

  get summary() {
    return '';
  }

  get min() {
    return this.actor.attributes.minDamage + this.minBy;
  }

  get max() {
    return this.actor.attributes.maxDamage + this.maxBy;
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

    this.defineEvent(
      'begin cast',
      'end cast',
      'begin recoil',
      'end recoil',
      'interupted'
    );

  }

  doAttack(target) {
    let maxDmg = this.max;
    let minDmg = this.min;
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
      if(this.actor.casting) {
        this.actor.casting.interupt();
      }
      this.raiseEvent('begin cast', this.name);
      this.actor.casting = this;
      this.castId = setTimeout(() => {
        action();
        this.lastUsed = this.now;
        this.raiseEvent('end cast', this.name);
        this.castId = -1;
        this.raiseEvent('begin recoil', this.name);
        this.recoilId = setTimeout(() => {
          this.raiseEvent('end recoil', this.name);
          this.casting = undefined;
          this.recoilId = -1;
          this.lock = false;
        }, this.recoilTime);
      }, this.castTime);
    }

  }

  interupt() {
    clearTimeout(this.castId);
    clearTimeout(this.recoilId);
    this.castId = -1;
    this.casting = undefined;
    this.recoilId = -1;
    this.lock = false;
    this.raiseEvent('interupted', this.name);
  }

}
