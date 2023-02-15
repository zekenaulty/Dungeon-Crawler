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
  availableOutOfCombat = false;
  availableOutOfCombatOnly = false;
  bubble = true;
  triggerGcd = true;
  name = 'base skill';
  castId;
  recoilId;
  cdId;
  mpCost = 5;
  
  get canCast() {
    let vm = this;
    
    return vm.mpCost <= vm.actor.attributes.mp;
  }

  get displayName() {
    return `base skill`;
  }

  get summary() {
    return '';
  }

  get min() {
    let vm = this;
    return vm.actor.attributes.minDamage + vm.minBy;
  }

  get max() {
    let vm = this;
    return vm.actor.attributes.maxDamage + vm.maxBy;
  }

  get now() {
    return new Date().getTime();
  }

  get onCd() {
    let vm = this;
    return vm.now - vm.lastUsed < vm.cooldown;
  }

  get onGcd() {
    let vm = this;
    if (!vm.actor.skills['GCD']) {
      return false;
    }
    return vm.actor.skills['GCD'].onCd;
  }

  get isGcd() {
    let vm = this;
    return vm === vm.actor.skills['GCD'];
  }

  gcd() {
    let vm = this;
    if (!vm.actor.skills['GCD'] || !vm.triggerGcd) {
      return;
    }
    vm.actor.skills['GCD'].invoke();
  }

  constructor(actor) {
    super();
    let vm = this;

    vm.actor = actor;
    vm.resetCooldown();

    vm.defineEvent(
      'begin cast',
      'end cast',
      'begin recoil',
      'end recoil',
      'interupted',
      'updated',
      'begin cd',
      'end cd'
    );

  }
  
  doHeal(target, percent = 0.5, cost = 20) {
    let vm = this;
    
    if(vm.actor.spendMp(cost)) {
      
    let amt = Math.ceil(target.attributes.maxHp * percent);
    target.heal(amt);
    
    }
    
  }

  doAttack(target, cost = 0) {
    if(!target) {
      return;
    }
    
    let vm = this;
    if(vm.actor.spendMp(cost)) {
    
    let maxDmg = vm.max;
    let minDmg = vm.min;
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
  }

  invoke() {

  }

  resetCooldown() {
    let vm = this;
    vm.lastUsed = vm.now - vm.cooldown;
  }

  refresh() {}

  safeInvoke(action) {
    let vm = this;

    if (vm.onGcd || vm.actor.casting === vm) {
      return;
    }

    if (!vm.onCd && vm.actor.attributes.hp >= 1) {
      if (vm.actor.casting && !vm.isGcd) {
        vm.actor.casting.interupt();
      }

      if (vm.isGcd) {
        vm.raiseEvent(
          'begin gcd',
          vm
        );
      }

      if (vm.bubble) {
        vm.raiseEvent(
          'begin cast',
          vm
        );
      }

      if (!vm.isGcd) {
        vm.actor.casting = vm;
        vm.gcd();
      }

      vm.castId = setTimeout(() => {

        /* run the actual skill */
        action();

        vm.lastUsed = vm.now;

        if (vm.bubble) {
          vm.raiseEvent(
            'begin cd',
            vm
          );
          vm.cdId = setTimeout(() => {
            if (vm.bubble) {
              vm.raiseEvent(
                'end cd',
                vm
              );
            }
          }, vm.cooldown);
        }

        if (vm.bubble) {
          vm.raiseEvent(
            'end cast',
            vm
          );
        }

        vm.castId = -1;

        if (vm.bubble) {
          vm.raiseEvent(
            'begin recoil',
            vm
          );
        }

        vm.recoilId = setTimeout(() => {

          if (vm.bubble) {
            vm.raiseEvent(
              'end recoil',
              vm
            );
          }

          if (!vm.isGcd) {
            vm.actor.casting = undefined;
            vm.raiseEvent('updated');
          } else {
            vm.raiseEvent(
              'end gcd',
              vm
            );
          }

          vm.recoilId = -1;

        }, vm.recoilTime);
      }, vm.castTime);
    }

  }

  interupt() {
    let vm = this;
    clearTimeout(vm.castId);
    clearTimeout(vm.recoilId);
    vm.castId = -1;
    vm.casting = undefined;
    vm.recoilId = -1;
    vm.lock = false;
    vm.raiseEvent(
      'interupted',
      vm
    );
  }

}
