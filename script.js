const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#e9ecef', // Match container background
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.NONE, // Disable auto-scaling
    width: 800,
    height: 600
  },
  render: {
    antialias: false,
    roundPixels: true
  }
};

const game = new Phaser.Game(config);

function create() {
  // Clean previous elements
  this.children.removeAll();

  // Position elements using camera center
  const centerX = this.cameras.main.centerX;
  const centerY = this.cameras.main.centerY;

  // Main Doro Button
  doroImage = this.add.image(centerX, centerY - 50, 'doro')
    .setInteractive()
    .setScale(0.25)
    .on('pointerdown', () => {
      doros += clickMultiplier;
      updateScore();
    });

  // Crisp Score Display
  scoreText = this.add.text(centerX, centerY + 80, 'Doros: 0', {
    fontSize: '34px',
    fill: '#2b2d2f',
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: '#ffffff',
    strokeThickness: 3,
    resolution: window.devicePixelRatio * 2 // Dynamic crispness
  }).setOrigin(0.5);

  // Rest of your game logic...
}