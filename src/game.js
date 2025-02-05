export class GameState {
  constructor() {
    this.doros = 0;
    this.clickMultiplier = 1;
    this.autoClickerCount = 0;
    this.autoClickerCost = 10;
    this.multiplierCost = 50;
  }
}

export function purchaseAutoClicker(gameState) {
  if (gameState.doros >= gameState.autoClickerCost) {
    gameState.doros -= gameState.autoClickerCost;
    gameState.autoClickerCount++;
    gameState.autoClickerCost = Math.round(gameState.autoClickerCost * 1.5);
  }
}

export function purchaseClickMultiplier(gameState) {
  if (gameState.doros >= gameState.multiplierCost) {
    gameState.doros -= gameState.multiplierCost;
    gameState.clickMultiplier++;
    gameState.multiplierCost = Math.round(gameState.multiplierCost * 1.5);
  }
}