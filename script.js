import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreDisplay = null;
let isDoroReady = false;

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
    this.load.image('doro', 'assets/doro.png')
        .on('loaderror', () => {
            console.error('Doro image failed to load! Verify path: assets/doro.png');
        });
}

function create() {
    this.children.removeAll();

    // Create Doro button with safe initialization
    doroButton = this.add.image(
        this.cameras.main.centerX,
        100,
        'doro'
    )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .on('pointerdown', () => {
        gameState.doros += gameState.clickMultiplier;
        updateScore();
    });

    // Set ready state after button creation
    isDoroReady = true;

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

    // Initial score update
    updateScore();
}

function update() {
    if (!isDoroReady || !scoreDisplay || !game.canvas) return;

    // Get accurate button position using Phaser's world transform
    const bounds = doroButton.getBounds();
    
    // Calculate screen position considering scaling
    const scaleX = game.scale.displayScale.x;
    const scaleY = game.scale.displayScale.y;
    const offsetX = game.scale.displayBounds.x;
    const offsetY = game.scale.displayBounds.y;

    // Convert game coordinates to screen coordinates
    const buttonScreenX = (bounds.x + bounds.width/2) * scaleX + offsetX;
    const buttonScreenY = bounds.y * scaleY + offsetY;
    const buttonHeight = bounds.height * scaleY;

    // Position score display under the button
    scoreDisplay.style.top = `${buttonScreenY + buttonHeight + 20}px`;
    scoreDisplay.style.left = `${buttonScreenX - scoreDisplay.offsetWidth/2}px`;

    // Force layout recalculation for accurate positioning
    void scoreDisplay.offsetWidth;
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