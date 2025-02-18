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
  disabled={!doros.gte(autoClickerCost)}
>
  Auto Clicker ({autoClickerCount}) - Cost: {autoClickerCost.toFixed()} Doros
</button>

<button 
  on:click={purchaseClickMultiplier}
  disabled={!doros.gte(multiplierCost)}
>
  Click Multiplier (x{clickMultiplier.toDecimalPlaces(1).toString()}) - Cost: {multiplierCost.toFixed()} Doros
</button>
    </div>
  </div>

<div class="score-display" style="transform: translateX(-50%)">
  Doros: {doros.toDecimalPlaces(2).toString()}
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
  }
</style>