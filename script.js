console.log("script.js loaded");

// Game state
let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;

// Phaser config
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
    mode: Phaser.Scale.NONE,
    width: window.innerWidth - 250, // Account for sidebar
    height: window.innerHeight - 100, // Account for title
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
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
  // Exact center calculation
  const centerX = this.sys.game.config.width / 2;
  const centerY = this.sys.game.config.height / 2;

  // Doro positioning
  this.doroImage = this.add.image(centerX, centerY - 50, 'doro')
    .setInteractive()
    .setScale(0.18)
    .setOrigin(0.5, 0.5)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Crisp text solution
  this.scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '32px',
    fill: '#000000',
    fontFamily: 'Courier New', // Monospace for crispness
    stroke: '#ffffff',
    strokeThickness: 4,
    resolution: window.devicePixelRatio * 2,
    shadow: {
      stroke: true,
      fill: true,
      offsetX: 2,
      offsetY: 2,
      color: '#000000',
      blur: 0
    }
  }).setOrigin(0.5).setPadding(4);

  // Game systems
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      doros += autoClickerCount;
      updateScore();
    },
    loop: true
  });

  // UI setup
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);
  updateButtons();
}

// ... rest of the functions remain unchanged ...

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