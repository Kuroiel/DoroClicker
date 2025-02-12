import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreText = null; // Phaser text reference
let doroButton = null; // Reference to the Doro button
let scoreContainer = null;

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
        update: update, // Add an update function
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    // IMPORTANT:  Remove scale settings that interfere with manual positioning.
    // width: 800,  // Remove
    // height: 600  // Remove
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('doro', 'assets/doro.png');
}

function create() {
    this.children.removeAll();

    // Create Doro button
    doroButton = this.add.image(
        game.config.width / 2, // Center X within the *configured* game width
        100,  // Start 100px from the top of the *canvas*.  Adjust as needed.
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

    // Initialize score display.  Get a reference to the container.
    scoreText = document.getElementById('score-display');
    scoreContainer = document.getElementById('score-container');
	//Correct the id
	scoreText.id = 'score-text';
    updateScore();

    // Call update to set initial positions.
    update();
}


function update() {
    // Doro button position is now set in `create` and is correct.

    // Position the score 120px below the Doro button.  Use getBottom().  Reduced to 120.
    if (doroButton && scoreContainer) {
        const doroBottom = doroButton.y + (doroButton.displayHeight / 2); //get bottom of doro
        scoreContainer.style.top = `${doroBottom + 120}px`; // Adjusted offset
    }
}


function updateScore() {
    scoreText.textContent = `Doros: ${gameState.doros}`;
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