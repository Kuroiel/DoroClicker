console.log("script.js loaded");

// Game state
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
    mode: Phaser.Scale.NONE,
    width: window.innerWidth - 250,
    height: window.innerHeight - 80,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
  // Get exact center coordinates
  const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
  const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

  // Create Doro button
  this.doroImage = this.add.image(centerX, centerY - 50, 'doro')
    .setInteractive()
    .setScale(0.18)
    .setOrigin(0.5, 0.5)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Create crisp score text
  this.scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '32px',
    fill: '#000000',
    fontFamily: 'Courier New',
    stroke: '#ffffff',
    strokeThickness: 4,
    resolution: window.devicePixelRatio * 3,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: '#000000',
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
  
  // Debug output
  console.log('Game Dimensions:', this.scale.width, this.scale.height);
  console.log('Doro Position:', this.doroImage.x, this.doroImage.y);
  console.log('Canvas Dimensions:', this.sys.game.canvas.width, this.sys.game.canvas.height);
}

// ... rest of the code remains unchanged ...