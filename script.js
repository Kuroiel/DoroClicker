console.log("script.js loaded");

// Game state variables
let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;

// Phaser configuration
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
  },
  render: {
    antialias: false,
    roundPixels: true,
    powerPreference: "high-performance"
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Clear previous elements
  this.children.removeAll();

  // Get true center coordinates
  const centerX = this.scale.width / 2;
  const centerY = this.scale.height / 2;

  // Doro button with precise scaling
  this.doroImage = this.add.image(centerX, centerY - 40, 'doro')
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .setOrigin(0.5, 0.5)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Ultra-crisp score text
  this.scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '28px',
    fill: '#2b2d2f',
    fontFamily: 'Courier New', // Monospace for crispness
    fontStyle: 'bold',
    stroke: '#ffffff',
    strokeThickness: 3,
    resolution: window.devicePixelRatio * 2,
    padding: { x: 10, y: 5 }
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

  // Initialize buttons
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);
  updateButtons();
}

function update() {}

function updateScore() {
  game.scene.scenes[0].scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

// Rest of the functions remain unchanged...
// [Keep the updateButtons, purchaseAutoClicker, and purchaseClickMultiplier functions from previous versions]

function update() {}

function updateScore() {
  game.scene.scenes[0].scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

function updateButtons() {
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  
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