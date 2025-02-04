// script.js

console.log("script.js loaded");

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
  console.log("Preload started");
  // Load the image asset
  // For testing, if you suspect an asset issue, try using an external URL:
  // this.load.image('doro', 'https://via.placeholder.com/100');
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  console.log("Create started");
  
  // Resume AudioContext on first user interaction
  // (If audio is not used, you can comment this out)
  this.input.once('pointerdown', () => {
    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
      console.log("Resuming audio context");
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
  
  // Log to confirm the image was added
  console.log("Doro image added:", doroImage);

  // When the image is clicked, increment the score
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
    console.log("Doro clicked, doros:", doros);
  });
}

function update() {
  // For now, nothing happens here.
}

function updateScore() {
  scoreText.setText('Doros: ' + doros);
}
