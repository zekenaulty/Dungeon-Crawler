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

  constructor() {
    super();

    this.level = new ActorLevel(this);
    this.attributes = new ActorAttributes(this);
    this.inventory = new ActorInventory(this);

    this.defineEvent(
      'constructed',
      'leveled up',
      'healed',
      'damaged',
      'death',
      'begin cast',
      'end cast',
      'begin recoil',
      'end recoil',
      'interupted'
    );

    this.addSkill('GCD', new GCD(this));
    this.addSkill('attack', new Attack(this));

    this.raiseEvent('constructed');
  }

  takeDamage(dmg) {
    this.attributes.hp -= dmg;
    this.raiseEvent('damaged', dmg);
    if (this.attributes.hp < 1) {
      this.raiseEvent('death');
    }
  }

  addSkill(key, skill) {
    let self = this;
    this.skills[key] = skill;
    
    skill.listenToEvent('begin cast', (n) => {
      self.raiseEvent('begin cast', n);
    });
    
    skill.listenToEvent('end cast', (n) => {
      self.raiseEvent('end cast', n);
    });
    
    skill.listenToEvent('begin recoil', (n) => {
      self.raiseEvent('begin recoil', n);
    });
    
    skill.listenToEvent('end recoil', (n) => {
      self.raiseEvent('end recoil', n);
    });
    
    skill.listenToEvent('interupted', (n) => {
      self.raiseEvent('interupted', n);
    });
    
  }

}
