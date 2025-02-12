import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
// No need for scoreContainer or titleElement at the top level anymore
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

    // Create Doro button.
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

    // Get references - ONLY get the SPAN now.
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display'); // Get the score display


    updateScore();
    update();  // Initial positioning
}



function update() {
     if (doroButton && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment ---
        // Center the Doro button within the *canvas*.
        doroButton.x = game.canvas.width / 2;

        // --- Vertical Score Positioning ---
        const doroBottom = doroButton.y + (doroButton.displayHeight / 2);
        // Use offsetTop/offsetLeft on the *scoreDisplay* element itself.
        scoreDisplay.style.top = `${doroBottom + 120}px`;

          // --- Horizontal Score Alignment ---

        // Get 'C' position from title element
        const titleElement = document.querySelector('.main-title');
        const titleRect = titleElement.getBoundingClientRect();
        const cPositionX = titleRect.left + (titleRect.width * (5 / 12));

        //Get r position from score display
        const scoreRect = scoreDisplay.getBoundingClientRect();
        const rPositionX = scoreRect.left + (scoreRect.width * (3/5));

        // Calculate the offset
        const scoreOffsetX =  cPositionX - rPositionX;

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