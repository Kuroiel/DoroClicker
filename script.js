// Game state
const gameState = {
    doros: new Decimal(0),
    autoClickerCount: 0,
    autoClickerCost: new Decimal(10),
    clickMultiplier: new Decimal(1),
    multiplierCost: new Decimal(50)
  };
  
  // Phaser config
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#e9ecef',
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    }
  };
  
  let game;
  let scoreDisplay;
  
  function preload() {
    this.load.image('doro', 'assets/doro.png');
  }
  
  function create() {
    game = this;
    
    // Create doro button
    const doro = this.add.image(400, 300, 'doro')
      .setInteractive()
      .setScale(0.18)
      .on('pointerdown', () => {
        gameState.doros = gameState.doros.add(gameState.clickMultiplier);
        updateUI();
      });
  
    // Create UI
    scoreDisplay = this.add.dom(400, 50).createFromCache(`
      <div class="score-display">
        Doros: ${gameState.doros.toFixed(2)}
      </div>
    `);
  
    // Auto-clicker loop
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        gameState.doros = gameState.doros.add(gameState.autoClickerCount);
        updateUI();
      },
      loop: true
    });
  }
  
  function update() {
    // Update UI position if needed
  }
  
  function updateUI() {
    scoreDisplay.node.innerHTML = `
      Doros: ${gameState.doros.toFixed(2)}
      <br>
      <button onclick="purchaseAutoClicker()" ${gameState.doros.lt(gameState.autoClickerCost) ? 'disabled' : ''}>
        Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost.toFixed()}
      </button>
      <button onclick="purchaseClickMultiplier()" ${gameState.doros.lt(gameState.multiplierCost) ? 'disabled' : ''}>
        Multiplier (x${gameState.clickMultiplier.toFixed(1)}) - Cost: ${gameState.multiplierCost.toFixed()}
      </button>
    `;
  }
  
  // Purchase functions
  window.purchaseAutoClicker = () => {
    if (gameState.doros.gte(gameState.autoClickerCost)) {
      gameState.doros = gameState.doros.sub(gameState.autoClickerCost);
      gameState.autoClickerCount++;
      gameState.autoClickerCost = gameState.autoClickerCost.times(1.15).ceil();
      updateUI();
    }
  };
  
  window.purchaseClickMultiplier = () => {
    if (gameState.doros.gte(gameState.multiplierCost)) {
      gameState.doros = gameState.doros.sub(gameState.multiplierCost);
      gameState.clickMultiplier = gameState.clickMultiplier.times(1.5);
      gameState.multiplierCost = gameState.multiplierCost.times(2.5).ceil();
      updateUI();
    }
  };
  
  // Start game
  new Phaser.Game(config);