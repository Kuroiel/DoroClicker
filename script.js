import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreDisplay = null;
let isDoroReady = false; // New state flag

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
    // Add error handling for image load
    this.load.image('doro', 'assets/doro.png')
        .on('loaderror', () => {
            console.error('Failed to load doro.png! Check the file path.');
        });
}

function create() {
    // Safety check for texture existence
    if (!this.textures.exists('doro')) {
        console.error('Doro texture not found!');
        return;
    }

    this.children.removeAll();

    // Create Doro button with explicit position
    doroButton = this.add.image(
        this.cameras.main.centerX, // Use camera's centerX
        100,
        'doro'
    )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .on('pointerdown', () => {
        gameState.doros += gameState.clickMultiplier;
        updateScore();
    });

    // Immediate initialization flag
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

    // Store buttons setup
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

    // DOM references
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');

    // Initial positioning call
    update();
}

function update() {
    // Enhanced safety check
    if (!isDoroReady || !scoreDisplay || !game.canvas) return;

    // Get display metrics
    const scale = game.scale.displayScale;
    const offset = game.scale.displayBounds;

    // Calculate button position
    const buttonX = doroButton.x * scale.x + offset.x;
    const buttonY = doroButton.y * scale.y + offset.y;
    const buttonHeight = doroButton.displayHeight * scale.y;

    // Update score position
    scoreDisplay.style.top = `${buttonY + buttonHeight + 20}px`;
    scoreDisplay.style.left = `${buttonX - (scoreDisplay.offsetWidth / 2)}px`;
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