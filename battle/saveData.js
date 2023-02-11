export class SaveData {

  static #slots = 'DC-GAME-SAVE-SLOTS';
  
  static addSlot(slot = 'auto') {
    let slots = JSON.parse(localStorage.getItem(SaveData.#slots));
    if (!slots) {
      slots = new Array();
    }

    if (!slots.includes(slot)) {
      slots.push(slot);
    }

    localStorage.setItem(SaveData.#slots, JSON.stringify(slot));
  }

  static getSlots() {
    return JSON.parse(localStorage.getItem(SaveData.#slots));
  }

  static slotName(useSlot = 'auto') {
    let slot = useSlot.toUpperCase();
    return `DC-GAME-${slot}`;
  }

  static save(game, useSlot = 'auto') {
    SaveData.addSlot(useSlot);
    localStorage.setItem(
      SaveData.slotName(useSlot),
      JSON.stringify(
        game.saveState()
      ));
  }

  static load(game, useSlot = 'auto') {
    game.loadState(SaveData.getState(useSlot));
  }

  static getState(useSlot = 'auto') {
    return JSON.parse(
      localStorage.getItem(
        SaveData.slotName(useSlot)
      ));
  }

}
