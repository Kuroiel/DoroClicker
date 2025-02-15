import { GameState, purchaseAutoClicker, purchaseClickMultiplier } from './src/game.js';

const gameState = new GameState();
let scoreTextValue = null;
let doroButton = null;
let scoreDisplay = null;
let isDoroReady = false;

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
    // Load image with error handling
    this.load.image('doro', 'assets/doro.png')
        .on('filecomplete', () => {
            isDoroReady = true;
            console.log('Doro image loaded successfully');
        })
        .on('loaderror', () => {
            console.error('Failed to load doro.png! Verify file exists at assets/doro.png');
        });
}

function create() {
    // Safety check for texture existence
    if (!this.textures.exists('doro')) {
        console.error('Doro texture not loaded!');
        return;
    }

    this.children.removeAll();

    // Create Doro button with explicit position
    doroButton = this.add.image(
        this.cameras.main.centerX,
        100,
        'doro'
    )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .on('pointerdown', () => {
        gameState.doros += gameState.clickMultiplier;
        updateScore();
    });

    // Initialize store buttons
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

    // Get DOM references
    scoreTextValue = document.getElementById('score-value');
    scoreDisplay = document.getElementById('score-display');

    // Auto-clicker system
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            gameState.doros += gameState.autoClickerCount;
            updateScore();
        },
        loop: true
    });

    // Initial score update
    updateScore();
}

function update() {
    // Enhanced safety checks
    if (!isDoroReady || !doroButton || !scoreDisplay || !game?.scale) return;

    // Get display metrics with null checks
    const scale = game.scale.displayScale || { x: 1, y: 1 };
    const offset = game.scale.displayBounds || { x: 0, y: 0 };

    // Get button bounds safely
    const bounds = doroButton.getBounds();
    if (!bounds) return;

    // Calculate screen position
    const buttonCenterX = (bounds.x + bounds.width/2) * scale.x + offset.x;
    const buttonBottom = (bounds.y + bounds.height) * scale.y + offset.y;

    // Position score display
    scoreDisplay.style.top = `${buttonBottom + 20}px`;
    scoreDisplay.style.left = `${buttonCenterX - scoreDisplay.offsetWidth/2}px`;
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