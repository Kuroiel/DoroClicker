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
let doroImage;
let scoreText;

function preload() {
  console.log("Preload started");
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  console.log("Create started");

  // Center Doro Image (Smaller)
  doroImage = this.add.image(400, 250, 'doro').setInteractive();
  doroImage.setScale(0.3); // Made it smaller

  // Score Text (Now Below the Doro Image)
  scoreText = this.add.text(400, 330, 'Doros: 0', {
    fontSize: '28px',
    fill: '#333'
  }).setOrigin(0.5); // Center text below the image

  // Clicking Doro Increases Score
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
  });
}

function update() {}

function updateScore() {
  scoreText.setText('Doros: ' + doros);
}
