import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreContainer = null;
let titleElement = null; // Reference to the title
let scoreDisplay = null; // Reference to the score display


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
        0,  // Initial X, will be adjusted
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

    // Get references after DOM is ready
    scoreContainer = document.getElementById('score-container');
    scoreTextValue = document.getElementById('score-value');
    titleElement = document.querySelector('.main-title'); // Get title element
    scoreDisplay = document.getElementById('score-display'); // Get score display

    updateScore();
    update();  // Initial positioning
}



function update() {
    if (doroButton && scoreContainer && titleElement && scoreDisplay) {
        // 1. Get the position of the 'C' in "Doro Clicker"
        const titleRect = titleElement.getBoundingClientRect();
        const cPosition = titleRect.left + (titleRect.width * (5 / 12)); // Approximate 'C' position

        // 2. Calculate the desired X for the Doro button (centered)
        const doroX = cPosition - (doroButton.displayWidth / 2) -  game.canvas.offsetLeft;


        // 3. Set the Doro button's X position
        doroButton.x = doroX;

        // 4.  Position Score Vertically
        const doroBottom = doroButton.y + (doroButton.displayHeight / 2);
        scoreContainer.style.top = `${doroBottom + 120}px`;

        // 5. Get 'r' position in "Doros"
        const scoreRect = scoreDisplay.getBoundingClientRect();
        const rPosition = scoreRect.left + (scoreRect.width * (3 / 5)) ;  // Approximate 'r' position

        // 6. calculate score container offset
        const scoreOffsetX =  cPosition - rPosition;

        // 7. Set score container position
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