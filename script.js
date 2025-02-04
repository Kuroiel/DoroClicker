// script.js

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

let doros = 0;
let autoClickerCost = 10;
let clickMultiplierCost = 50;
let clickMultiplier = 1;
let scoreText;
let doroImage;

function preload() {
  // Ensure the path matches your repo structure
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  // Resume AudioContext on first interaction
  this.input.once('pointerdown', () => {
    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  });

  // Add score text to the top-left corner
  scoreText = this.add.text(16, 16, 'Doros: 0', { fontSize: '32px', fill: '#333' });

  // Add the clickable doro image in the center of the canvas
  doroImage = this.add.image(400, 300, 'doro').setInteractive();

  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
  });
}

function update() {
  // Update loop (if needed)
}

function updateScore() {
  scoreText.setText('Doros: ' + doros);
}
