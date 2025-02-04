console.log("script.js loaded");

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#f4f4f4',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
};

const game = new Phaser.Game(config);

// Game variables
let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;
let doroImage = null;
let scoreText = null;

// DOM elements
let autoClickerButton, clickMultiplierButton;

function preload() {
  this.load.image('doro', 'assets/doro.png')
    .on('fileerror', () => {
      console.error("Failed to load doro.png! Check assets folder");
    });
}

function create() {
  // Clear previous elements if any
  if (doroImage) doroImage.destroy();
  if (scoreText) scoreText.destroy();

  // Get DOM references
  autoClickerButton = document.getElementById('auto-clicker');
  clickMultiplierButton = document.getElementById('click-multiplier');

  // Initialize buttons
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);

  // Create Doro image
  doroImage = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 50,
    'doro'
  )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.25)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Create score text
  scoreText = this.add.text(
    this.scale.width / 2,
    this.scale.height / 2 + 100,
    'Doros: 0',
    {
      fontSize: '32px',
      fill: '#2d2d2d',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 3
    }
  ).setOrigin(0.5);

  // Auto-clicker system
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      doros += autoClickerCount;
      updateScore();
    },
    loop: true
  });

  updateButtons();
}

function update() {
  // Reserved for frame updates
}

function updateScore() {
  scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

function updateButtons() {
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < multiplierCost;
  autoClickerButton.textContent = `Auto Clicker (${autoClickerCount}) - Cost: ${autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${clickMultiplier}) - Cost: ${multiplierCost} Doros`;
}

function purchaseAutoClicker() {
  if (doros >= autoClickerCost) {
    doros -= autoClickerCost;
    autoClickerCount++;
    autoClickerCost = Math.round(autoClickerCost * 1.5);
    updateScore();
  }
}

function purchaseClickMultiplier() {
  if (doros >= multiplierCost) {
    doros -= multiplierCost;
    clickMultiplier++;
    multiplierCost = Math.round(multiplierCost * 1.5);
    updateScore();
  }
}