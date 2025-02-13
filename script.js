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
        doroButton.x = game.canvas.width / 2;

        // --- Vertical and Horizontal Score Positioning (Combined and Corrected) ---
        // 1. Get Doro button's *center* X and bottom Y.
        const doroCenterX = doroButton.x;
        const doroBottomY = doroButton.y + (doroButton.displayHeight / 2);

        // 2.  Wait for scoreDisplay to have its *final* size before positioning.
        requestAnimationFrame(() => {
            // 3. Calculate the *center* X of the score display.
            const scoreDisplayCenterX = scoreDisplay.offsetWidth / 2;

            // 4. Position the score display.
            scoreDisplay.style.top = `${doroBottomY + 20}px`; // Vertical offset
            scoreDisplay.style.left = `${doroCenterX - scoreDisplayCenterX}px`; // Center horizontally
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