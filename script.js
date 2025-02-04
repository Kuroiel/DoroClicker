// Create a Phaser game configuration object
const config = {
  type: Phaser.AUTO,
  width: 800,  // adjust based on your design needs
  height: 600,
  backgroundColor: '#f4f4f4',
  parent: null, // or specify a container div id if you want to mount it in a specific element
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game variables
let doros = 0;
let autoClickerCost = 10;
let clickMultiplierCost = 50;
let clickMultiplier = 1;
let autoClickerTimer;  // we'll use Phaser's time events instead of setInterval
let scoreText;
let doroImage;

function preload() {
  // Load your assets. Make sure the asset paths are correct.
  this.load.image('doro', 'assets/doro.png');
  // You can also load additional images, e.g., for helper doros, if needed.
}

function create() {
  // Add score text to the top-left corner
  scoreText = this.add.text(16, 16, 'Doros: 0', { fontSize: '32px', fill: '#333' });
  
  // Add the clickable doro image in the center
  doroImage = this.add.image(400, 300, 'doro').setInteractive();

  // When the doro image is clicked, increment doros
  doroImage.on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
    // In a full game you would call checkUpgrades() here
  });

  // Example: if you want to simulate buying an auto-clicker immediately (or after a button press)
  // You could set up an input keyboard key or another clickable game object for upgrades.

  // For auto-clicker functionality using Phaser’s time event:
  // (This is just an example; you might want to start it only after the player buys the upgrade)
  // Uncomment the following line to simulate an auto-clicker starting immediately:
  // autoClickerTimer = this.time.addEvent({ delay: 1000, callback: autoClick, callbackScope: this, loop: true });
}

function update() {
  // Use this update loop if you have animations or need to check something continuously.
}

// Helper function to update score display
function updateScore() {
  scoreText.setText('Doros: ' + doros);
}

// Auto-clicker callback function
function autoClick() {
  doros += clickMultiplier;
  updateScore();
}
