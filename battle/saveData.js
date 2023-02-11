export class SaveData {

  static slotName(useSlot = 'auto') {
    let slot = useSlot.toUpperCase();
    return `DC-GAME-${slot}`;
  }

  static save(game, useSlot = 'auto') {
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
