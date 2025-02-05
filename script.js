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
    update: () => {} // Empty update function
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
  this.load.image('doro', 'assets/doro.png')
    .once('fileerror', () => {
      alert('Error: Missing doro.png in assets folder!');
    });
}

function create() {
  // Clear previous elements
  this.children.removeAll();

  // Create Doro button (absolute center)
  this.doroImage = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 50,
    'doro'
  )
  .setInteractive()
  .setScale(0.18)
  .on('pointerdown', () => {
    doros += clickMultiplier;
    this.scoreText.setText(`Doros: ${doros}`);
    updateButtons();
  });

  // Create score text
  this.scoreText = this.add.text(
    this.scale.width / 2,
    this.scale.height / 2 + 80,
    'Doros: 0', 
    {
      fontSize: '32px',
      fill: '#000',
      fontFamily: 'Arial',
      stroke: '#fff',
      strokeThickness: 4,
      resolution: 2
    }
  ).setOrigin(0.5);

  // Initialize game systems
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      doros += autoClickerCount;
      this.scoreText.setText(`Doros: ${doros}`);
      updateButtons();
    },
    loop: true
  });

  // Initialize buttons
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');
  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);
  updateButtons();

  // Debug positioning
  console.log('Doro Position:', this.doroImage.x, this.doroImage.y);
  console.log('Canvas Dimensions:', this.sys.game.canvas.width, this.sys.game.canvas.height);
}

// ... [keep existing purchase functions and updateButtons] ...