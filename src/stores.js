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
// Add safety checks in purchase functions
export function purchaseAutoClicker() {
  gameState.update(state => {
    // Convert all values to Decimal explicitly
    const currentDoros = new Decimal(state.doros);
    const currentCost = new Decimal(state.autoClickerCost);

    if (currentDoros.gte(currentCost)) {
      return {
        ...state,
        doros: currentDoros.minus(currentCost),
        autoClickerCount: state.autoClickerCount + 1,
        autoClickerCost: currentCost.times(1.15).ceil()
      };
    }
    return state;
  });
  console.log('Attempting purchase. Current doros:', state.doros.toString());
console.log('Cost:', currentCost.toString());
console.log('Can purchase:', currentDoros.gte(currentCost));
}

export function purchaseClickMultiplier() {
  gameState.update(state => {
    const currentDoros = new Decimal(state.doros);
    const currentCost = new Decimal(state.multiplierCost);

    if (currentDoros.gte(currentCost)) {
      return {
        ...state,
        doros: currentDoros.minus(currentCost),
        clickMultiplier: new Decimal(state.clickMultiplier).times(1.5),
        multiplierCost: currentCost.times(2.5).ceil()
      };
    }
    return state;
  });
  console.log('Attempting purchase. Current doros:', state.doros.toString());
console.log('Cost:', currentCost.toString());
console.log('Can purchase:', currentDoros.gte(currentCost));
}

// Add to stores.js
export const gameState = writable(initial, () => {
  return () => {} // Cleanup
}, (key, value) => {
  if (Decimal.isDecimal(value)) return value.toString();
  return value;
});