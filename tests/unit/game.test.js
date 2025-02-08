import { 
  GameState,
  purchaseAutoClicker,
  purchaseClickMultiplier 
} from '../../src/game.js';

describe('Game Logic', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  test('Initial state', () => {
    expect(gameState.doros).toBe(0);
    expect(gameState.clickMultiplier).toBe(1);
  });

  test('Auto-clicker purchase', () => {
    gameState.doros = 20;
    purchaseAutoClicker(gameState);
    expect(gameState.autoClickerCount).toBe(1);
    expect(gameState.doros).toBe(10);
    expect(gameState.autoClickerCost).toBe(15);
  });

  test('Click multiplier purchase', () => {
    gameState.doros = 60;
    purchaseClickMultiplier(gameState);
    expect(gameState.clickMultiplier).toBe(2);
    expect(gameState.doros).toBe(10);
    expect(gameState.multiplierCost).toBe(75);
  });
});