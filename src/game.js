export class GameState {
  constructor() {
    this.doros = 0;
    this.clickMultiplier = 1;
    this.autoClickerCount = 0;
    this.autoClickerCost = 10;
    this.multiplierCost = 50;
  }
}

export function purchaseAutoClicker(state) {
  if (state.doros >= state.autoClickerCost) {
    state.doros -= state.autoClickerCost;
    state.autoClickerCount++;
    state.autoClickerCost = Math.round(state.autoClickerCost * 1.5);
    return true;
  }
  return false;
}

export function purchaseClickMultiplier(state) {
  if (state.doros >= state.multiplierCost) {
    state.doros -= state.multiplierCost;
    state.clickMultiplier++;
    state.multiplierCost = Math.round(state.multiplierCost * 1.5);
    return true;
  }
  return false;
}