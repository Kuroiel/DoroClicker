// script.js

// Configure the Phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f4f4f4',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game state variables
let doros = 0;
let clickMultiplier = 1;
let scoreText;
let doroImage;

function preload() {
  // Load the image asset
  // Make sure the path matches your repository structure
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Resume AudioContext on first user interaction (for audio compatibility)
  this.input.once('pointerdown', () => {
    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  });

  // Create score text at the top left
  scoreText = this.add.text(16, 16, 'Doros: 0', {
    fontSize: '32px',
    fill: '#333'
  });

  // Add the clickable doro image to the center of the canvas
  doroImage = this.add.image(400, 300, 'doro').setInteractive();

  // When the image is clicked, increment the score
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
  });
}

function update() {
  // Update loop (if needed for future functionality)
}

// Helper function to update the score display
function updateScore() {
  scoreText.setText('Doros: ' + doros);
}
