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
    powerPreference: "high-performance" // Added this line
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Clear previous elements
  this.children.removeAll();

  // Adjusted center coordinates (150px left offset)
  const centerX = this.scale.width / 2 - 150; // ← Changed this line
  const centerY = this.scale.height / 2;

  // Doro button with precise scaling
  this.doroImage = this.add.image(centerX, centerY - 40, 'doro')
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18) // ← Changed scale to 0.18
    .setOrigin(0.5, 0.5)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Ultra-crisp score text
  this.scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '26px', // Reduced from 34px
    fill: '#2b2d2f',
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: '#ffffff',
    strokeThickness: 4, // Increased stroke
    resolution: window.devicePixelRatio * 3, // Triple resolution
    padding: { x: 15, y: 8 },
    shadow: { // Added shadow properties
      offsetX: 2,
      offsetY: 2,
      color: '#00000055',
      blur: 0,
      stroke: true,
      fill: true
    }
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