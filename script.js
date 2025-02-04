console.log("script.js loaded");

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#f4f4f4',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  render: {
    antialias: false // Crisper text
  }
};

const game = new Phaser.Game(config);

let doros = 0;
let clickMultiplier = 1;
let autoClickerCount = 0;
let autoClickerCost = 10;
let multiplierCost = 50;
let doroImage = null;
let scoreText = null;

let autoClickerButton, clickMultiplierButton;

function preload() {
  this.load.image('doro', 'assets/doro.png');
}

function create() {
  if (doroImage) doroImage.destroy();
  if (scoreText) scoreText.destroy();

  autoClickerButton = document.getElementById('auto-clicker');
  clickMultiplierButton = document.getElementById('click-multiplier');

  autoClickerButton.addEventListener('click', purchaseAutoClicker);
  clickMultiplierButton.addEventListener('click', purchaseClickMultiplier);

  // Perfectly centered Doro
  doroImage = this.add.image(
    this.scale.width / 2,
    this.scale.height / 2 - 40,
    'doro'
  )
  .setInteractive({ cursor: 'pointer' })
  .setScale(0.25)
  .setOrigin(0.5, 0.5)
  .on('pointerdown', () => {
    doros += clickMultiplier;
    updateScore();
  });

  // Crisp score text
  scoreText = this.add.text(
    this.scale.width / 2,
    this.scale.height / 2 + 80,
    'Doros: 0', 
    {
      fontSize: '38px',
      fill: '#2d2d2d',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4,
      resolution: 2 // Crisper text
    }
  )
  .setOrigin(0.5)
  .setShadow(2, 2, '#00000050', 2);

  this.time.addEvent({
    delay: 1000,
    callback: () => {
      doros += autoClickerCount;
      updateScore();
    },
    loop: true
  });

  updateButtons();
}

function update() {}

function updateScore() {
  scoreText.setText(`Doros: ${doros}`);
  updateButtons();
}

function updateButtons() {
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < multiplierCost;
  autoClickerButton.textContent = `Auto Clicker (${autoClickerCount}) - Cost: ${autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${clickMultiplier}) - Cost: ${multiplierCost} Doros`;
}

function purchaseAutoClicker() {
  if (doros >= autoClickerCost) {
    doros -= autoClickerCost;
    autoClickerCount++;
    autoClickerCost = Math.round(autoClickerCost * 1.5);
    updateScore();
  }
}

function purchaseClickMultiplier() {
  if (doros >= multiplierCost) {
    doros -= multiplierCost;
    clickMultiplier++;
    multiplierCost = Math.round(multiplierCost * 1.5);
    updateScore();
  }
}