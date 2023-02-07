import { List } from '../../core/list.js';
import { EventHandler } from '../../core/eventHandler.js'
import { ActorSkill } from './actorSkill.js';
import { ActorLevel } from './actorLevel.js';
import { ActorAttributes } from './actorAttributes.js';
import { ActorInventory } from './actorInventory.js';

export class Actor extends EventHandler {

  attributes;
  level;
  inventory;
  skills = {};
  target;

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
      'death'
    );

    this.addSkill('GCD', new GCD(this));
    this.addSkill('attack', new BasicAttack(this));

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
    this.skills[key] = skill;
  }


} /* end Actor */


class GCD extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 250;
  }

  invoke() {
    safeInvoke(() => { /* GCD DO NOTHING */ });
  }

}

class BasicAttack extends ActorSkill {

  constructor(actor) {
    super(actor);
    this.cooldown = 1000;
    this.register = true;
  }

  invoke(target) {
    safeInvoke(() => {
      this.doAttack(target);
    });
  }

}
