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
        gameState.update(state => ({
          ...state,
          doros: state.doros.plus(state.autoClickerCount)
        }));
      },
      loop: true
    });
  }
}

export function initializePhaserGame() {
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#e9ecef',
    scene: [Game],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    },
  };

  return new Phaser.Game(config);
}