import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreText = null; // Phaser text reference

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  dom: {
    createContainer: true
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

  // Create Doro button
  const doro = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 200,
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

  // Initialize score display
  scoreText = document.getElementById('score-display');
  updateScore();
}

function updateScore() {
  // Update both DOM and Phaser text if needed
  scoreText.textContent = `Doros: ${gameState.doros}`;
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

// Remove unused positionScoreText and domElements