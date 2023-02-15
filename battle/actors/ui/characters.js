import { List } from '../../../core/list.js';
import { Modal } from '../../../layout/modal/modal.js';
import { Nameplate } from './nameplate.js';

export class Characters {
  
  static characters; /* hax to be refactored */

  static show(game) {
    let vm = Characters;
    
    
      if (!vm.characters) {
        vm.characters = new Modal();
        vm.characters.nav = document.createElement('span');
        vm.characters.nav.style.position = 'fixed';
        vm.characters.nav.style.bottom = '50px';
        vm.characters.nav.style.left = '1vw';
        vm.characters.nav.style.width = '98vw';
        vm.characters.nav.style.display = 'flex';
        vm.characters.nav.style.flexFlow = 'row';
        vm.characters.nav.style.justifyContent = 'space-evenly';
        vm.characters.nav.style.textAlign = 'start';
        vm.characters.nav.style.zIndex = '31000';

        vm.characters.warrior = new Nameplate(vm.characters.nav, game.warrior);
        vm.characters.healer = new Nameplate(vm.characters.nav, game.healer);
        vm.characters.mage = new Nameplate(vm.characters.nav, game.mage);

        vm.characters.warrior.box.style.width = '100px';
        vm.characters.healer.box.style.width = '100px';
        vm.characters.mage.box.style.width = '100px';

        vm.characters.warrior.box.style.border = '1px dashed white';
        vm.characters.warrior.box.style.padding = '3px 1px 6px 12px';
        vm.characters.warrior.box.style.borderRadius = '13px 13px 13px 13px';
        vm.characters.warrior.box.style.margin = '3px 3px 3px 3px';
        vm.characters.warrior.box.addEventListener('click', () => {
          vm.characters.warrior.box.style.border = '1px dashed white';
          vm.characters.healer.box.style.border = '1px dashed transparent';
          vm.characters.mage.box.style.border = '1px dashed transparent';
          game.healerDetail.close();
          game.mageDetail.close();
          game.warriorDetail.open();
        });

        vm.characters.healer.box.style.padding = '3px 1px 6px 12px';
        vm.characters.healer.box.style.borderRadius = '13px 13px 13px 13px';
        vm.characters.healer.box.style.margin = '3px 3px 3px 3px';
        vm.characters.healer.box.addEventListener('click', () => {
          vm.characters.healer.box.style.border = '1px dashed white';
          vm.characters.warrior.box.style.border = '1px dashed transparent';
          vm.characters.mage.box.style.border = '1px dashed transparent';
          game.healerDetail.open();
          game.mageDetail.close();
          game.warriorDetail.close();
        });

        vm.characters.mage.box.style.padding = '3px 1px 6px 12px';
        vm.characters.mage.box.style.borderRadius = '13px 13px 13px 13px';
        vm.characters.mage.box.style.margin = '3px 3px 3px 3px';
        vm.characters.mage.box.addEventListener('click', () => {
          vm.characters.mage.box.style.border = '1px dashed white';
          vm.characters.warrior.box.style.border = '1px dashed transparent';
          vm.characters.healer.box.style.border = '1px dashed transparent';
          game.healerDetail.close();
          game.mageDetail.open();
          game.warriorDetail.close();
        });

        vm.characters.listenToEvent('closing', () => {
          game.healerDetail.close();
          game.mageDetail.close();
          game.warriorDetail.close();
          document.body.removeChild(vm.characters.nav);
        });
      }

      vm.characters.open(true);
      game.warriorDetail.open();
      document.body.appendChild(vm.characters.nav);

    
  }
}
