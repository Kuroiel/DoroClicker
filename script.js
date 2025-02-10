import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let domScore; // Reference to the DOM element

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
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Clear previous elements
  this.children.removeAll();

  // Create Doro button
  const doroImage = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 50,
    'doro'
  )
  .setInteractive({ cursor: 'pointer' })
  .setScale(0.18)
  .on('pointerdown', () => {
    gameState.doros += gameState.clickMultiplier;
    updateScore();
  });

  // Create DOM element for score (for Selenium testing)
  domScore = this.add.dom(20, 20).createElement('div', '', 'Doros: <span id="score-text">0</span>');
  domScore.setAttribute('id', 'score-display');
  domScore.style.cssText = 'font-size: 24px; color: white; position: absolute;';

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
  // Update the DOM element's score
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