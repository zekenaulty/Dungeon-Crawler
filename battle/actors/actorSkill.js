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
  bubble = true;
  triggerGcd = true;
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

  get isGcd() {
    return this === this.actor.skills['GCD'];
  }

  gcd() {
    if (!this.actor.skills['GCD'] || !this.triggerGcd) {
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
    let self = this;

    if (self.lock || self.onGcd) {
      return;
    }

    self.lock = true;


    if (!self.onCd && !self.onGcd && self.actor.attributes.hp >= 1) {
      if (self.actor.casting && !self.isGcd) {
        self.actor.casting.interupt();
      }

      if (self.isGcd) {
        self.raiseEvent(
          'begin gcd',
          self
        );
      }

      if (self.bubble) {
        self.raiseEvent(
          'begin cast',
          self
        );
      }

      if (!self.isGcd) {
        self.actor.casting = self;
        self.gcd();
      }

      self.castId = setTimeout(() => {

        /* run the actual skill */
        action();

        //console.log(this);

        self.lastUsed = self.now;

        if (self.bubble) {
          self.raiseEvent(
            'end cast',
            self
          );
        }

        self.castId = -1;

        if (self.bubble) {
          self.raiseEvent(
            'begin recoil',
            self
          );
        }

        self.recoilId = setTimeout(() => {

          if (self.bubble) {
            self.raiseEvent(
              'end recoil',
              self
            );
          }

          if (!self.isGcd) {
            self.actor.casting = undefined;
          } else {
            self.raiseEvent(
              'end gcd',
              self
            );
          }

          self.recoilId = -1;
          self.lock = false;

        }, self.recoilTime);
      }, self.castTime);
    }

  }

  interupt() {
    clearTimeout(this.castId);
    clearTimeout(this.recoilId);
    this.castId = -1;
    this.casting = undefined;
    this.recoilId = -1;
    this.lock = false;
    this.raiseEvent(
      'interupted',
      this
    );
  }

}