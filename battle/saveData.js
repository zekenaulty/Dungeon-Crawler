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

    localStorage.setItem(SaveData.#slots, JSON.stringify(slots));
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

  static remove(slot) {
    let slots = SaveData.getSlots().filter((e) => {
      return slot != e;
    });
    localStorage.setItem(SaveData.#slots, JSON.stringify(slots));
    localStorage.removeItem(SaveData.slotName(slot));
  }

}
