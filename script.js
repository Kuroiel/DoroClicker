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
  // Load the Doro image asset
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Clear any previous display objects
  this.children.removeAll();

  // Position the main Doro closer to the top
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

  // Setup store buttons from the DOM
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

  // Update the score and button state based on the current data
  updateScore();

  // Align #score-text to match the title area
  positionScoreText();

  // Create score display
const scoreText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 - 150, // Position score display below Doro button
  'Doros: 0',
  {
    fontSize: 24,
    color: '#2d3436',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: 200,
  }
);
}

function updateScore() {
  scoreText.setText(`Doros: ${gameState.doros}`);
  if (!scoreElement) {
    console.error('Score element not found');
    return;
  }
  scoreElement.textContent = gameState.doros;
  updateButtons();
}
function updateButtons() {
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');

  // Disable buttons if the cost is too high
  autoClickerButton.disabled = gameState.doros < gameState.autoClickerCost;
  clickMultiplierButton.disabled = gameState.doros < gameState.multiplierCost;

  // Update button text to reflect current cost and counts
  autoClickerButton.textContent = `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${gameState.clickMultiplier}) - Cost: ${gameState.multiplierCost} Doros`;
}

function positionScoreText() {
  const scoreElement = document.getElementById('score-text');
  // Use absolute positioning so it aligns near the title
  scoreElement.style.position = 'absolute';
  // Adjust these values so it sits properly under/near your title
  scoreElement.style.top = '60px';
  scoreElement.style.left = '50%';
  scoreElement.style.transform = 'translateX(-50%)';
}

// Cache DOM elements
const domElements = {
  scoreText: document.getElementById('score-text'),
  autoClickerBtn: document.getElementById('auto-clicker'),
  clickMultiplierBtn: document.getElementById('click-multiplier')
};
