import App from './App.svelte';
import { initializePhaserGame } from './game.js';
import { gameState } from './stores.js';

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    target: document.getElementById('svelte-ui'),
  });

  initializePhaserGame(gameState);
});