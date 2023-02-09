import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'
import { ActorSkill } from './actorSkill.js';
import { ActorLevel } from './actorLevel.js';
import { ActorAttributes } from './actorAttributes.js';
import { ActorInventory } from './actorInventory.js';
import { Attack } from './skills/attack.js';
import { GCD } from './skills/gcd.js';

export class Actor extends EventHandler {

  name = 'base actor';
  attributes;
  level;
  inventory;
  skills = {};
  target;
  enemies = new List();
  casting;
  gameLevel;

  constructor(gameLevel) {
    super();

    this.gameLevel = gameLevel;

    this.level = new ActorLevel(this);
    this.attributes = new ActorAttributes(this);
    this.inventory = new ActorInventory(this);

    this.defineEvent(
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
      'end gcd'
    );

    this.addSkill('GCD', new GCD(this));
    this.addSkill('attack', new Attack(this));

    this.raiseEvent('actor constructed', this);
  }

  takeDamage(dmg) {
    this.attributes.hp -= dmg;
    this.raiseEvent('damaged', this, dmg);
    if (this.attributes.hp < 1) {
      this.raiseEvent(
        'death',
        {
          actor: this,
          gameLevel: this.gameLevel
        });
    }
  }

  addSkill(key, skill) {
    this.skills[key] = skill;

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
    return hostile ? enemies.sample() : this;
  }

}
