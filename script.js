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
    update();
}

function update() {
    if (doroButton && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment (Corrected) ---
        doroButton.x = game.config.width / 2; // Use game.config.width

        // --- Vertical and Horizontal Score Positioning (Combined and Corrected) ---

        // Use requestAnimationFrame for *all* positioning calculations.
        requestAnimationFrame(() => {
             // Get Doro button's *center* X and *center* Y.  Use Phaser's properties.
            const doroCenterX = doroButton.x;
            const doroCenterY = doroButton.y;  // Use the *center* Y, not the bottom.

            // Calculate the top of the score display.
            const scoreDisplayTop = doroCenterY + (doroButton.displayHeight / 2) + 20; // Below Doro

            // Calculate the *center* X of the score display.
            const scoreDisplayCenterX = scoreDisplay.offsetWidth / 2;
             // Calculate score display left
            const scoreDisplayLeft =  doroCenterX - scoreDisplayCenterX;

             // Apply the styles.
            scoreDisplay.style.top = `${scoreDisplayTop}px`;
            scoreDisplay.style.left = `${scoreDisplayLeft}px`;

            // Debugging: Log *everything*.
            console.log("--- update() ---");
            console.log("Doro Center X:", doroCenterX);
            console.log("Doro Center Y:", doroCenterY);
            console.log("Doro Display Height:", doroButton.displayHeight);
            console.log("Calculated Score Top:", scoreDisplayTop);
            console.log("Score Display Offset Width:", scoreDisplay.offsetWidth);
            console.log("Calculated Score Left:", scoreDisplayLeft);
            console.log("Final Score Style:", scoreDisplay.style.cssText);


             // Check for conflicting styles (add this)
            const computedStyle = window.getComputedStyle(scoreDisplay);
            console.log("Computed Style:", computedStyle);
            for (const prop of ['position', 'top', 'left', 'transform', 'margin', 'padding']) {
                 if (computedStyle[prop] !== scoreDisplay.style[prop]) {
                    console.warn(`Style conflict on property '${prop}':`,
                        `Expected: ${scoreDisplay.style[prop]}, Got: ${computedStyle[prop]}`);
                 }
            }
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