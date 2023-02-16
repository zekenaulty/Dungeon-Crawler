import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'
import { ActorSkill } from './actorSkill.js';
import { ActorLevel } from './actorLevel.js';
import { ActorAttributes } from './actorAttributes.js';
import { ActorInventory } from './actorInventory.js';
import { ActorParty } from './actorParty.js';
import { Attack } from './skills/attack.js';
import { GCD } from './skills/gcd.js';
import { Modal } from '../../layout/modal/modal.js';

export class Actor extends EventHandler {

  name = 'base actor';
  attributes;
  level;
  inventory;
  skills = {};
  target;
  friendlyTarget;
  enemies = new List();
  casting;
  gameLevel;
  battle;
  autoBattle = true;
  party;
  displayName;
  #aiId = -1;
  aiIntervalMin = 1250;
  aiIntervalMax = 1750;

  constructor(gameLevel) {
    super();
    let vm = this;

    vm.gameLevel = gameLevel;

    vm.level = new ActorLevel(vm);
    vm.attributes = new ActorAttributes(vm);
    vm.inventory = new ActorInventory(vm);
    vm.party = new ActorParty(vm);

    vm.defineEvent(
      'actor constructed',
      'leveled up',
      'healed',
      'damaged',
      'death',
      'begin cast',
      'end cast',
      'begin recoil',
      'end recoil',
      'interupted',
      'begin gcd',
      'end gcd',
      'changed'
    );

    vm.addSkill('GCD', new GCD(vm));
    vm.addSkill('attack', new Attack(vm));

    vm.raiseEvent('actor constructed', vm);

  }

  spendMp(amt) {
    let vm = this;
    if (amt <= vm.attributes.mp) {
      vm.attributes.mp -= amt;
      vm.raiseEvent('changed', vm);
      return true
    }

    return false;
  }

  heal(amt) {
    let vm = this;
    let hp = vm.attributes.hp + amt;
    let over = 0;
    if (vm.attributes.maxHp < hp) {
      over = hp - vm.attributes.maxHp;
      vm.attributes.hp += (amt - over);
    } else {
      vm.attributes.hp += amt;
    }
    vm.raiseEvent('healed', vm, amt, over);
    vm.raiseEvent('changed', vm);
  }

  takeDamage(dmg) {
    let vm = this;
    vm.attributes.hp -= dmg;
    vm.raiseEvent('damaged', vm, dmg);
    vm.raiseEvent('changed', vm);
    if (vm.attributes.hp < 1) {
      vm.attributes.hp = 0;
      vm.raiseEvent(
        'death',
        vm
      );
    }
  }

  addSkill(key, skill) {
    let vm = this;
    vm.skills[key] = skill;

    skill.listenToEvent('begin cast', (n) => {
      n.actor.raiseEvent('begin cast', n);
    });

    skill.listenToEvent('end cast', (n) => {
      n.actor.raiseEvent('end cast', n);
    });

    skill.listenToEvent('begin recoil', (n) => {
      n.actor.raiseEvent('begin recoil', n);
    });

    skill.listenToEvent('end recoil', (n) => {
      n.actor.raiseEvent('end recoil', n);
    });

    skill.listenToEvent('interupted', (n) => {
      n.actor.raiseEvent('interupted', n);
    });

  }

  get ascii() {
    return '';
  }

  getTarget(hostile = true) {
    let vm = this;
    if (vm.target && hostile && vm.target.attributes.hp > 1 && vm.enemies.includes(vm.target)) {
      return vm.target;
    }
    return hostile ? vm.enemies.sample() : vm.party.random();
  }

  recover() {
    let vm = this;

    vm.attributes.hp = vm.attributes.maxHp;
    vm.attributes.mp = vm.attributes.maxMp;

    vm.raiseEvent('changed', vm);
  }

  lowHealth(p = 0.3) {
    let vm = this;
    let low = Math.floor(vm.attributes.maxHp * p);
    return vm.attributes.hp <= low;
  }

  reset() {}

  buyAttribute(attributeName) {
    let vm = this;
    let a = attributeName.toLowerCase();
    let allowed = [
      'strength',
      'vitality',
      'intellect'
      ];
    if (allowed.includes(a) && vm.attributes.available > 0) {
      vm.attributes.available--;
      vm.attributes[a]++;
    }
  }

  spendPoints() {}

  aiCanAct() {
    let vm = this;

    if (
      !vm.autoBattle ||
      vm.casting ||
      !vm.battle ||
      vm.battle.paused ||
      Modal.openCount > 1 ||
      vm.attributes.hp < 1
    ) {
      return false;
    }
    return true;
  }

  saveState() {
    let vm = this;
    return {
      xp: vm.level.xp,
      level: vm.level.level,
      hp: vm.attributes.hp,
      mp: vm.attributes.mp,
      gold: vm.inventory.gold,
      points: vm.attributes.available,
      strength: vm.attributes.strength,
      intellect: vm.attributes.intellect,
      vitality: vm.attributes.vitality,
      baseDamage: vm.attributes.baseDamage,
      baseHp: vm.attributes.baseHp,
      baseMp: vm.attributes.baseMp,
      pointsPerLevel: vm.attributes.pointsPerLevel,
      autoBattle: vm.autoBattle,
    }
  }

  loadState(state) {
    let vm = this;

    while (vm.level.level < state.level) {
      vm.level.levelUp();
    }

    vm.level.xp = state.xp;
    vm.attributes.hp = state.hp;
    vm.attributes.mp = state.mp;
    vm.attributes.available = state.points;
    vm.inventory.gold = state.gold;
    vm.attributes.strength = state.strength;
    vm.attributes.intellect = state.intellect;
    vm.attributes.vitality = state.vitality;
    vm.attributes.baseDamage = state.baseDamage;
    vm.attributes.baseHp = state.baseHp;
    vm.attributes.baseMp = state.baseMp;
    vm.attributes.pointsPerLevel = state.pointsPerLevel;
    vm.autoBattle = state.autoBattle;

  }
  
  /*  dexterity should factor 
      into these numbers 
      a.k.a. speed */
  get #aiInterval() {
    let vm = this;
    let r = Math.floor(Math.random() * vm.aiIntervalMax) + 1;
    let v = Math.floor(Math.random() * 400);
    if (r < vm.aiIntervalMin) {
      r = vm.aiIntervalMin;
    }

    return r + v;
  }

  aiLoop() {}

  startAi() {
    let vm = this;
    vm.#aiId = setInterval(() => {
        vm.aiLoop();
      },
      vm.#aiInterval
    );
  }

  stopAi() {
    let vm = this;
    clearInterval(vm.#aiId);
    vm.#aiId = -1;
  }


}
