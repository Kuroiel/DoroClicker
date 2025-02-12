import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreContainer = null;
let titleElement = null;
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
     scale: {  //Keep scale for resize
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
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

    // Create Doro button.  X will be set in update().
    doroButton = this.add.image(
        0,
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

    // Get references
    scoreContainer = document.getElementById('score-container');
    scoreTextValue = document.getElementById('score-value');
    titleElement = document.querySelector('.main-title');
    scoreDisplay = document.getElementById('score-display');


    updateScore();
    update();  // Initial positioning
}



function update() {
    if (doroButton && scoreContainer && titleElement && scoreDisplay && game.canvas) {
        // --- Doro Button Alignment ---
        const titleRect = titleElement.getBoundingClientRect();
        // 'C' position relative to the *viewport*.
        const cPositionX = titleRect.left + (titleRect.width * (5 / 12));
        // Doro button X *relative to the canvas*.
        const doroX = (game.canvas.width / 2) ;

        doroButton.x = doroX

        // --- Vertical Score Positioning ---
        const doroBottom = doroButton.y + (doroButton.displayHeight / 2);
        scoreContainer.style.top = `${doroBottom + 120}px`;


        // --- Horizontal Score Alignment ---
        const scoreRect = scoreDisplay.getBoundingClientRect();
        const rPositionX = scoreRect.left + (scoreRect.width * (3/5));

        // Calculate the offset *relative to the canvas*.
        const scoreOffsetX = cPositionX -  game.canvas.offsetLeft - rPositionX;
        scoreContainer.style.left = `${scoreOffsetX}px`;

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