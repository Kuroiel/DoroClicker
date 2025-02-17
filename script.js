const gameState = {
    doros: new Decimal(0),
    autoClickerCount: 0,
    autoClickerCost: new Decimal(10),
    clickMultiplier: new Decimal(1),
    multiplierCost: new Decimal(50)
  };
  
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
  let doroSprite;
  let scoreDisplay;
  
  function preload() {
    this.load.image('doro', 'assets/doro.png');
  }
  
  function create() {
    game = this;
    
    // Center doro button
    doroSprite = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100, // Position higher for score below
      'doro'
    )
    .setInteractive()
    .setScale(0.18)
    .on('pointerdown', () => {
      gameState.doros = gameState.doros.add(gameState.clickMultiplier);
      updateUI();
    });
  
    // Initialize UI elements
    scoreDisplay = document.getElementById('score-display');
    updateUI();
  
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
    // Update score position relative to doro button
    if (doroSprite) {
      const bounds = doroSprite.getBounds();
      const yPos = bounds.y + bounds.height + 20;
      document.getElementById('score-display-container').style.top = `${yPos}px`;
    }
  }
  
  function updateUI() {
    scoreDisplay.textContent = `Doros: ${gameState.doros.toDecimalPlaces(2)}`;
    
    const autoClickerBtn = document.getElementById('auto-clicker-btn');
    autoClickerBtn.textContent = 
      `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost.toFixed()}`;
    autoClickerBtn.disabled = !gameState.doros.gte(gameState.autoClickerCost);
  
    const multiplierBtn = document.getElementById('multiplier-btn');
    multiplierBtn.textContent = 
      `Multiplier (x${gameState.clickMultiplier.toFixed(1)}) - Cost: ${gameState.multiplierCost.toFixed()}`;
    multiplierBtn.disabled = !gameState.doros.gte(gameState.multiplierCost);
  }
  
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
  
  // Initialize the game
  new Phaser.Game(config);