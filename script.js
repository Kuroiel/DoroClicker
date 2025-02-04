console.log("script.js loaded");

// Define Phaser functions FIRST
function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Clear previous elements
  this.children.removeAll();

  // Get DOM elements
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');

  // Center coordinates
  const centerX = this.scale.width / 2;
  const centerY = this.scale.height / 2;

  // Main Doro Button (visible)
  this.doroImage = this.add.image(centerX, centerY - 50, 'doro')
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.25)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Score Display (crisp)
  this.scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '34px',
    fill: '#2b2d2f',
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: '#ffffff',
    strokeThickness: 3,
    resolution: 2
  }).setOrigin(0.5);

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

function update() {}

// Game configuration AFTER function definitions
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#e9ecef',
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
  }
};

// Initialize game LAST
const game = new Phaser.Game(config);

// Game state variables
let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;

// Button logic
function updateButtons() {
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < multiplierCost;
  autoClickerButton.textContent = `Auto Clicker (${autoClickerCount}) - Cost: ${autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${clickMultiplier}) - Cost: ${multiplierCost} Doros`;
}

function updateScore() {
  game.scene.scenes[0].scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

// Purchase functions
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

// Initialize button event listeners
document.getElementById('auto-clicker').addEventListener('click', purchaseAutoClicker);
document.getElementById('click-multiplier').addEventListener('click', purchaseClickMultiplier);