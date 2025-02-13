// Import statements are CRUCIAL for modules.  Make SURE these are correct.
import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState(); // Keep this for your button updates.
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
        update: update, // Make SURE this is included.
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
    // doro button
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

     // Setup store buttons (Keep this!)
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


    // Get references
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');
    if (!scoreDisplay) {
        console.error("ERROR: #score-display element not found!");
    } else {
        console.log("#score-display found:", scoreDisplay);
    }

    updateScore(); // updates the score
    update(); // calls the update method
}

function update() {
    console.log("update() called"); // See if this appears in the console.

    if (doroButton && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment ---
        doroButton.x = game.canvas.width / 2;

        // --- Vertical and Horizontal Score Positioning (Combined and Corrected) ---
        const doroCenterX = doroButton.x;
        const doroBottomY = doroButton.y + (doroButton.displayHeight / 2);

        requestAnimationFrame(() => {
            const scoreDisplayCenterX = scoreDisplay.offsetWidth / 2;

            scoreDisplay.style.top = `${doroBottomY + 20}px`;
            scoreDisplay.style.left = `${doroCenterX - scoreDisplayCenterX}px`;
            console.log("Score display positioned:", scoreDisplay.style.top, scoreDisplay.style.left);
        });
    } else {
        console.warn("update(): doroButton, scoreDisplay, or game.canvas is null/undefined");
    }
}

function updateScore() {
    if (scoreTextValue) {
        scoreTextValue.textContent = gameState.doros;
    }
    updateButtons(); // Ensure buttons get updated
}

function updateButtons() {
  const autoClickerButton = document.getElementById('auto-clicker');
  const clickMultiplierButton = document.getElementById('click-multiplier');

  autoClickerButton.disabled = gameState.doros < gameState.autoClickerCost;
  clickMultiplierButton.disabled = gameState.doros < gameState.multiplierCost;

  autoClickerButton.textContent = `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost} Doros`;
  clickMultiplierButton.textContent = `Click Multiplier (x${gameState.clickMultiplier}) - Cost: ${gameState.multiplierCost} Doros`;
}