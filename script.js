console.log("script.js loaded");

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f4f4f4',
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game variables
let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;
let doroImage;
let scoreText;

// DOM Elements
let autoClickerButton;
let clickMultiplierButton;

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Get DOM references
  autoClickerButton = document.getElementById('auto-clicker');
  clickMultiplierButton = document.getElementById('click-multiplier');
  
  // Set up button event listeners
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);

  // Create centered Doro Image
  doroImage = this.add.image(
    this.sys.game.config.width / 2, 
    this.sys.game.config.height / 2 - 50, 
    'doro'
  ).setInteractive();
  doroImage.setScale(0.3);

  // Create visible score text
  scoreText = this.add.text(
    this.sys.game.config.width / 2,
    this.sys.game.config.height / 2 + 100,
    'Doros: 0', 
    {
      fontSize: '32px',
      fill: '#2d2d2d',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 3
    }
  ).setOrigin(0.5);

  // Click handler
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
    updateButtons();
  });

  // Auto-clicker loop
  this.time.addEvent({
    delay: 1000,
    callback: autoClick,
    callbackScope: this,
    loop: true
  });

  // Initial button state
  updateButtons();
}

function update() {}

function updateScore() {
  scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

function autoClick() {
  doros += autoClickerCount;
  updateScore();
}

function purchaseAutoClicker() {
  if (doros >= autoClickerCost) {
    doros -= autoClickerCost;
    autoClickerCount++;
    autoClickerCost = Math.round(autoClickerCost * 1.5);
    updateScore();
    updateButtons();
  }
}

function purchaseClickMultiplier() {
  if (doros >= multiplierCost) {
    doros -= multiplierCost;
    clickMultiplier++;
    multiplierCost = Math.round(multiplierCost * 1.5);
    updateScore();
    updateButtons();
  }
}

function updateButtons() {
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < multiplierCost;
  autoClickerButton.textContent = `Auto Clicker (${autoClickerCount}) - Cost: ${autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${clickMultiplier}) - Cost: ${multiplierCost} Doros`;
}