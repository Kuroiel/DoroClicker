import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  dom: {
    createContainer: true // Allows DOM elements over canvas
  },
  backgroundColor: '#e9ecef',
  scene: {
    preload: preload,
    create: create,
    update: () => {}
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  this.children.removeAll();

  // Create clickable Doro
  const doro = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 200, // Move Doro button up by 200 pixels
    'doro'
  )
  .setInteractive({ cursor: 'pointer' })
  .setScale(0.18)
  .on('pointerdown', () => {
    gameState.doros += gameState.clickMultiplier;
    updateScore();
  });

  // Auto-clicker system
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      gameState.doros += gameState.autoClickerCount;
      updateScore();
    },
    loop: true
  });

  // Setup store buttons
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');

  autoClickerButton.addEventListener('click', () => {
    purchaseAutoClicker(gameState);
    updateScore();
  });

  clickMultiplierButton.addEventListener('click', () => {
    purchaseClickMultiplier(gameState);
    updateScore();
  });

  updateButtons();
}

function updateScore() {
  document.getElementById('score-text').textContent = gameState.doros;
  updateButtons();
}

function updateButtons() {
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');

  autoClickerButton.disabled = gameState.doros < gameState.autoClickerCost;
  clickMultiplierButton.disabled = gameState.doros < gameState.multiplierCost;

  autoClickerButton.textContent = `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${gameState.clickMultiplier}) - Cost: ${gameState.multiplierCost} Doros`;
}
