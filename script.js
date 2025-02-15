import { gameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

class GameState {
  constructor() {
    this.doros = new Decimal(0);
    this.autoClickerCount = 0;
    this.autoClickerCost = new Decimal(10);
    this.clickMultiplier = new Decimal(1);
    this.multiplierCost = new Decimal(50);
  }
}

// Initialize game
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  const doro = this.add.image(400, 300, 'doro')
    .setInteractive()
    .on('pointerdown', () => {
      gameState.doros = gameState.doros.add(gameState.clickMultiplier);
      updateUI();
    });

  // Auto-clicker loop
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      gameState.doros = gameState.doros.add(gameState.autoClickerCount);
      updateUI();
    },
    loop: true
  });
}

// Svelte-like reactive UI
function updateUI() {
  const ui = document.getElementById('svelte-ui');
  ui.innerHTML = `
    <div class="score-display">
      Doros: ${gameState.doros.toFixed(2)}
    </div>
    <div class="sidebar">
      <button onclick="purchaseAutoClicker()" ${gameState.doros.lt(gameState.autoClickerCost) ? 'disabled' : ''}>
        Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost.toFixed()}
      </button>
      <button onclick="purchaseClickMultiplier()" ${gameState.doros.lt(gameState.multiplierCost) ? 'disabled' : ''}>
        Multiplier (x${gameState.clickMultiplier.toFixed(1)}) - Cost: ${gameState.multiplierCost.toFixed()}
      </button>
    </div>
  `;
}

// Initialize
window.gameState = new GameState();
window.purchaseAutoClicker = purchaseAutoClicker;
window.purchaseClickMultiplier = purchaseClickMultiplier;
updateUI();