import Phaser from 'phaser';
import { gameState } from './stores.js';

export class Game extends Phaser.Scene {
  constructor() {
    super('main');
    this.doroButton = null;
  }

  preload() {
    this.load.image('doro', 'assets/doro.png');
  }

  create() {
    // Create clickable doro image
    this.doroButton = this.add.image(
      this.cameras.main.centerX,
      100,
      'doro'
    )
    .setInteractive({ cursor: 'pointer' })
    .setScale(0.18)
    .on('pointerdown', () => {
      gameState.update(state => ({
        ...state,
        doros: state.doros.plus(state.clickMultiplier)
      }));
    });

    // Setup auto-clicker
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        gameState.update(state => {
          if (state.autoClickerCount > 0) {
            const autoGain = state.clickMultiplier.mul(state.autoClickerCount);
            return { ...state, doros: state.doros.add(autoGain) };
          }
          return state;
        });
      },
      loop: true
    });
  }
    // Add this update() method to the Game class
update() {
  if (this.doroButton) {
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
      const bounds = this.doroButton.getBounds();
      const canvasRect = this.game.canvas.getBoundingClientRect();
      
      // Convert Phaser coordinates to screen coordinates
      const doroBottomScreen = canvasRect.top + bounds.bottom;
      const doroCenterXScreen = canvasRect.left + bounds.centerX;
      
      scoreDisplay.style.top = `${doroBottomScreen + 20}px`;
      scoreDisplay.style.left = `${doroCenterXScreen}px`;
    }
  }
}
  }


export function initializePhaserGame() {
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#e9ecef',
    scene: [Game],
    scale: {
      mode: Phaser.Scale.RESIZE, // Changed from FIT to RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    },
    transparent: true // Add this to see through phaser canvas
  };

  return new Phaser.Game(config);
}