import { List } from '../../../core/list.js';
import { Actor } from '../actor.js';
import { ActorSkill } from '../actorSkill.js';
import { ActorLevel } from '../actorLevel.js';
import { ActorInventory } from '../actorInventory.js';
import { ActorAttributes } from '../actorAttributes.js';
import { Cleave } from '../skills/cleave.js';

export class Hero extends Actor {
  
  constructor() {
    super();
    
    this.skills['cleave'] = new Cleave(this);
  }
  
}