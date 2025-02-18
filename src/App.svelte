<script>
  import { gameState, purchaseAutoClicker, purchaseClickMultiplier } from './stores.js';
  import { onMount } from 'svelte';

  let doros, autoClickerCount, autoClickerCost, clickMultiplier, multiplierCost;

  const unsubscribe = gameState.subscribe(state => {
    doros = state.doros;
    autoClickerCount = state.autoClickerCount;
    autoClickerCost = state.autoClickerCost;
    clickMultiplier = state.clickMultiplier;
    multiplierCost = state.multiplierCost;
  });

  onMount(() => unsubscribe);
</script>

<div class="ui-overlay">
  <div class="title-container">
    <h1 class="main-title">Doro Clicker</h1>
  </div>
  
  <div class="sidebar">
    <h2>Helper Doros</h2>
    <div class="helper-doros-container">
<button 
  on:click={purchaseAutoClicker}
  disabled={!$gameState.doros.gte($gameState.autoClickerCost)}
>
  Auto Clicker ({$gameState.autoClickerCount}) - Cost: {$gameState.autoClickerCost.toFixed()}
</button>

<button 
  on:click={purchaseClickMultiplier}
  disabled={!$gameState.doros.gte($gameState.multiplierCost)}
>
  Multiplier (x{$gameState.clickMultiplier.toFixed(1)}) - Cost: {$gameState.multiplierCost.toFixed()}
</button>
    </div>
  </div>

<div class="score-display" style="transform: translateX(-50%)">
  Doros: {doros.toDecimalPlaces(2).toString()}
    DEBUG: {JSON.stringify($gameState, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  )}
</div>
</div>

<style>
  .ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
      z-index: 1000;
  pointer-events: none;
  }

  .score-display, .sidebar {
    pointer-events: auto;
  }

  .score-display {
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    font-size: 1.2em;
      /* Ensure visibility */
  opacity: 1 !important;
  visibility: visible !important;
  /* Initial positioning */
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  }

  #game-container {
  position: relative;
  z-index: 1;
}
</style>