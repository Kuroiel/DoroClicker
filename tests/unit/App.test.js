import { render, fireEvent } from '@testing-library/svelte';
import App from '../../src/App.svelte';
import { gameState, purchaseAutoClicker } from '../../src/stores.js';

describe('App Component', () => {
  beforeEach(() => {
    gameState.set({
      doros: new Decimal(0),
      autoClickerCount: 0,
      autoClickerCost: new Decimal(10),
      clickMultiplier: new Decimal(1),
      multiplierCost: new Decimal(50),
    });
  });

  test('displays initial doros count', async () => {
    const { getByText } = render(App);
    expect(getByText('Doros: 0.00')).toBeInTheDocument();
  });

  test('enables buttons when enough doros', async () => {
    gameState.update(state => ({
      ...state,
      doros: new Decimal(100)
    }));
    
    const { getByText } = render(App);
    const autoClickerButton = getByText(/Auto Clicker/);
    expect(autoClickerButton).not.toBeDisabled();
  });
});