import App from './App.svelte';
import { initializePhaserGame } from './game.js';
import { gameState } from './stores.js';

// Initialize Svelte app
const app = new App({
  target: document.getElementById('svelte-ui'),
});

// Initialize Phaser game with store reference
initializePhaserGame(gameState);