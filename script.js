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
	  console.log("Create started");

  // Center Doro Image with proper sizing
  doroImage = this.add.image(400, 300, 'doro').setInteractive(); // Moved down to Y:300
  doroImage.setScale(0.2); // Reduced scale from 0.3 to 0.2

  // Score Text with better visibility
  scoreText = this.add.text(400, 400, 'Doros: 0', { // Moved down to Y:400
    fontSize: '32px', // Increased from 28px
    fill: '#2d2d2d', // Darker color
    fontStyle: 'bold',
    stroke: '#ffffff', // White outline
    strokeThickness: 3
  }).setOrigin(0.5);

  // Rest of your create() function...

  // Get DOM references
  autoClickerButton = document.getElementById('auto-clicker');
  clickMultiplierButton = document.getElementById('click-multiplier');
  
  // Set up button event listeners
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);

  // Create game objects
  doroImage = this.add.image(400, 250, 'doro').setInteractive();
  doroImage.setScale(0.3);
  
  scoreText = this.add.text(400, 330, 'Doros: 0', {
    fontSize: '28px',
    fill: '#333'
  }).setOrigin(0.5);

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
  // Update button states
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < multiplierCost;
  
  // Update button text
  autoClickerButton.textContent = `Auto Clicker (${autoClickerCount}) - Cost: ${autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${clickMultiplier}) - Cost: ${multiplierCost} Doros`;
}