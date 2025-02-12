import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreDisplay = null; // Directly reference the #score-display

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

    // Get references - directly to the #score-display and the span
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');

    updateScore();
    update(); // Initial positioning
}

function update() {
 if (doroButton && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment ---
        doroButton.x = game.canvas.width / 2;

        // --- Vertical Score Positioning ---
        const doroBottom = doroButton.y + (doroButton.displayHeight / 2);
        scoreDisplay.style.top = `${doroBottom + 120}px`;

        // --- Horizontal Score Alignment ---
        // Get 'C' position from title element (calculate this *once*)
        const titleElement = document.querySelector('.main-title');
        const titleRect = titleElement.getBoundingClientRect();
        const cPositionX = titleRect.left + (titleRect.width * (5 / 12));

        // Get 'r' position *relative to the score display itself*.
        // Since scoreDisplay is now absolutely positioned and we are setting its
        // left style directly, we don't need getBoundingClientRect() here.
        // We can approximate the 'r' position based on the *known* content.
        const rPositionX = scoreDisplay.clientWidth * (3 / 11);  //  Adjust this fraction!

        // Calculate and set the *left* style of the #score-display.
        const scoreOffsetX = cPositionX - game.canvas.offsetLeft - rPositionX;
        scoreDisplay.style.left = `${scoreOffsetX}px`;
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