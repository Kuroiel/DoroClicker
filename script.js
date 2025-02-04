// script.js

console.log("script.js loaded");

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',  // Tells Phaser to insert the canvas into the #game-container div
  backgroundColor: '#f4f4f4',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
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
  console.log("Preload started");
  // Load the image asset
  // For testing, you can temporarily switch to a placeholder if needed:
  // this.load.image('doro', 'https://via.placeholder.com/100');
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  console.log("Create started");

  // Resume AudioContext on first user interaction (if audio is used)
  this.input.once('pointerdown', () => {
    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
      console.log("Resuming audio context");
      this.sound.context.resume();
    }
  });

  // Create score text at the top left of the canvas
  scoreText = this.add.text(16, 16, 'Doros: 0', {
    fontSize: '32px',
    fill: '#333'
  });

  // Add the clickable doro image at the center of the canvas
  doroImage = this.add.image(400, 300, 'doro').setInteractive();
  console.log("Doro image added:", doroImage);

  // When the image is clicked, increment the score and update the display
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
    console.log("Doro clicked, doros:", doros);
  });
}

function update() {
  // Update loop (if needed for further functionality)
}

function updateScore() {
  scoreText.setText('Doros: ' + doros);
}
