import App from './App.svelte';
import { initializePhaserGame } from './game.js';
import { gameState } from './stores.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Svelte first
  const app = new App({
    target: document.getElementById('svelte-ui'),
  });

  // Then initialize Phaser
  initializePhaserGame(gameState);
});