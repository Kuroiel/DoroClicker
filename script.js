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
        0, // X will be set in update()
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

    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');

    updateScore();
    update(); // Initial positioning
}
function update() {
    if (doroButton && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment ---
        doroButton.x = game.config.width / 2;

        // --- Vertical and Horizontal Score Positioning (Combined and Corrected) ---
        requestAnimationFrame(() => {
            // Use getBounds() for the most accurate position and size.
            const doroBounds = doroButton.getBounds();

            // Position the score display.
            scoreDisplay.style.position = 'absolute'; // Set position: absolute in JS
            scoreDisplay.style.top = `${doroBounds.bottom + 20}px`; // Position below Doro
            scoreDisplay.style.left = `${doroBounds.centerX - scoreDisplay.offsetWidth / 2}px`; // Center
            scoreDisplay.style.zIndex = '101';     // Ensure it's on top
            scoreDisplay.style.padding = '8px 16px'; // Add padding in JS

            // Optional: Remove the extensive debugging logs now, or keep them for a bit longer.
        });
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