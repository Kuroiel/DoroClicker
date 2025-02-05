console.log("script.js loaded");
import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game';

// Initialize game state
const gameState = new GameState();

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
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
  },
  render: {
    antialias: false,
    roundPixels: true
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
function create() {
  // Clear previous elements
  this.children.removeAll();

  // Create Doro button
  this.doroImage = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 50,
    'doro' // <-- Verify this matches your image key
  )
  .setInteractive({ cursor: 'pointer' })
  .setScale(0.18)
  .on('pointerdown', () => {
    gameState.doros += gameState.clickMultiplier;
    updateScore();
  });

  // Create score text
  this.scoreText = this.add.text(
    this.scale.width / 2,
    this.scale.height / 2 + 80,
    'Doros: 0',
    {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Times New Roman, Times, serif',
      resolution: 6
    }
  ).setOrigin(0.5);
}

  // Auto-clicker system
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      gameState.doros += gameState.autoClickerCount;
      updateScore();
    },
    loop: true
  });

  // Initialize buttons
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  autoClickerButton.addEventListener('click', () => purchaseAutoClicker(gameState));
  clickMultiplierButton.addEventListener('click', () => purchaseClickMultiplier(gameState));
  updateButtons();
}

function updateScore() {
  game.scene.scenes[0].scoreText.setText(`Doros: ${gameState.doros}`);
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