import { writable } from 'svelte/store';
import { Decimal } from 'decimal.js';

export const gameState = writable({
  doros: new Decimal(0),
  autoClickerCount: 0,
  autoClickerCost: new Decimal(10),
  clickMultiplier: new Decimal(1),
  multiplierCost: new Decimal(50),
});

// Game logic functions
export function purchaseAutoClicker() {
  gameState.update(state => {
    if (state.doros.gte(state.autoClickerCost)) {
      return {
        ...state,
        doros: state.doros.minus(state.autoClickerCost),
        autoClickerCount: state.autoClickerCount + 1,
        autoClickerCost: state.autoClickerCost.times(1.15).ceil(),
      };
    }
    return state;
  });
}

export function purchaseClickMultiplier() {
  gameState.update(state => {
    if (state.doros.gte(state.multiplierCost)) {
      return {
        ...state,
        doros: state.doros.minus(state.multiplierCost),
        clickMultiplier: state.clickMultiplier.times(1.5),
        multiplierCost: state.multiplierCost.times(2.5).ceil(),
      };
    }
    return state;
  });
}