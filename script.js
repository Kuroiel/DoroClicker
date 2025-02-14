import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreDisplay = null;

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    backgroundColor: '#e9ecef',
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('doro', 'assets/doro.png');
}

function create() {
    this.children.removeAll();

    // Create Doro button
    doroButton = this.add.image(
        game.config.width / 2,
        100,
        'doro'
    )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .on('pointerdown', () => {
        gameState.doros += gameState.clickMultiplier;
        updateScore();
    });

    // Auto-clicker system
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            gameState.doros += gameState.autoClickerCount;
            updateScore();
        },
        loop: true
    });

    // Setup store buttons
    const autoClickerButton = document.getElementById('auto-clicker');
    const clickMultiplierButton = document.getElementById('click-multiplier');

    autoClickerButton.addEventListener('click', () => {
        purchaseAutoClicker(gameState);
        updateScore();
    });

    clickMultiplierButton.addEventListener('click', () => {
        purchaseClickMultiplier(gameState);
        updateScore();
    });

    // Get DOM references
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');

    // Handle image load completion
    this.load.on('filecomplete-image-doro', () => {
        updateScore();
        update();
    });
    this.load.start();
}

function update() {
  if (doroButton && scoreDisplay && game.canvas) {
    // Get Phaser's display calculations
    const scaleX = game.scale.displayScale.x;
    const scaleY = game.scale.displayScale.y;
    const offsetX = game.scale.displayBounds.x;
    const offsetY = game.scale.displayBounds.y;

    // Calculate actual screen position of doro button
    const buttonX = doroButton.x * scaleX + offsetX;
    const buttonY = doroButton.y * scaleY + offsetY;
    const buttonHeight = doroButton.displayHeight * scaleY;

    // Position score display relative to game-container
    scoreDisplay.style.top = `${buttonY + buttonHeight + 20}px`; // 20px margin
    scoreDisplay.style.left = `${buttonX - (scoreDisplay.offsetWidth / 2)}px`;
    
    // Force reflow for accurate positioning
    void scoreDisplay.offsetWidth;
  }
}

function updateScore() {
    if (scoreTextValue) {
        scoreTextValue.textContent = gameState.doros;
    }
    updateButtons();
}

function updateButtons() {
    const autoClickerButton = document.getElementById('auto-clicker');
    const clickMultiplierButton = document.getElementById('click-multiplier');

    autoClickerButton.disabled = gameState.doros < gameState.autoClickerCost;
    clickMultiplierButton.disabled = gameState.doros < gameState.multiplierCost;

    autoClickerButton.textContent = `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost} Doros`;
    clickMultiplierButton.textContent = `Click Multiplier (x${gameState.clickMultiplier}) - Cost: ${gameState.multiplierCost} Doros`;
}