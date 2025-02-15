import { gameState, purchaseAutoClicker, purchaseClickMultiplier } from '../../src/stores.js';
import { Decimal } from 'decimal.js';

describe('Game Logic', () => {
  beforeEach(() => {
    // Reset state before each test
    gameState.set({
      doros: new Decimal(0),
      autoClickerCount: 0,
      autoClickerCost: new Decimal(10),
      clickMultiplier: new Decimal(1),
      multiplierCost: new Decimal(50),
    });
  });

  test('Initial state', () => {
    const state = gameState.get();
    expect(state.doros.toNumber()).toBe(0);
    expect(state.clickMultiplier.toNumber()).toBe(1);
  });

  test('Auto-clicker purchase', () => {
    gameState.update(state => ({ ...state, doros: new Decimal(20) }));
    purchaseAutoClicker();
    
    const state = gameState.get();
    expect(state.autoClickerCount).toBe(1);
    expect(state.doros.toNumber()).toBe(10);
    expect(state.autoClickerCost.toNumber()).toBe(12); // 10 * 1.15 = 11.5 → ceil to 12
  });

  test('Click multiplier purchase', () => {
    gameState.update(state => ({ ...state, doros: new Decimal(60) }));
    purchaseClickMultiplier();
    
    const state = gameState.get();
    expect(state.clickMultiplier.toNumber()).toBe(1.5); // Now 1.5x per purchase
    expect(state.doros.toNumber()).toBe(10); // 60 - 50 = 10
    expect(state.multiplierCost.toNumber()).toBe(125); // 50 * 2.5 = 125
  });
});