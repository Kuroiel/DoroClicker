console.log("script.js loaded");

// Configure Phaser to attach its canvas into the "game-container" div.
const config = {
  type: Phaser.AUTO,
  width: 800,    // game canvas width
  height: 600,   // game canvas height
  backgroundColor: '#f4f4f4',
  parent: 'game-container',  // Inject the canvas here
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
let doroImage;
let scoreText; // (Phaser text, optional if you prefer using the DOM)

// Preload assets
function preload() {
  console.log("Preload started");
  // Load the doro image asset (ensure the path is correct)
  this.load.image('doro', 'assets/doro.png');
}

// Create the scene
function create() {
  console.log("Create started");
  
  // (Optional) Resume AudioContext if needed on first interaction
  this.input.once('pointerdown', () => {
    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
  });
  
  // Add the doro image to the center of the canvas
  doroImage = this.add.image(400, 300, 'doro').setInteractive();
  // Scale down the doro image so it doesn't cover everything:
  doroImage.setScale(0.5);  // adjust scale as needed
  
  // When the image is clicked, increase doros and update the DOM score
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
    console.log("Doro clicked, doros:", doros);
  });
  
  // (Optional) If you want to display a Phaser text element inside the canvas,
  // you could add it here. For now, we are updating the DOM element with id "score".
  // scoreText = this.add.text(16, 16, 'Doros: 0', { fontSize: '32px', fill: '#333' });
}

// Update loop (if needed)
function update() {
  // No continuous updates needed for a simple clicker game.
}

// Update the score in the DOM sidebar
function updateScore() {
  document.getElementById('score').textContent = 'Doros: ' + doros;
}
