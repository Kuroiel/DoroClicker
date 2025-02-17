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
  let doroSprite = null; // Explicit null initialization
  
  function preload() {
    this.load.image('doro', 'assets/doro.png')
      .on('loaderror', () => {
        console.error('Doro image failed to load!');
        // Create red fallback rectangle
        const graphics = this.make.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(0, 0, 100, 100);
        graphics.generateTexture('doro', 100, 100);
        graphics.destroy();
      });
  }
  
  function create() {
    game = this;
    
    // Create doro with position validation
    if (this.textures.exists('doro')) {
      doroSprite = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        'doro'
      )
      .setInteractive()
      .setScale(0.18)
      .on('pointerdown', () => {
        gameState.doros = gameState.doros.plus(gameState.clickMultiplier);
        updateUI();
      });
    } else {
      console.error('Doro texture not available!');
    }
  
    // Force initial UI update
    updateUI();
    
    // Auto-clicker loop
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        gameState.doros = gameState.doros.plus(gameState.autoClickerCount);
        updateUI();
      },
      loop: true
    });
  }
  
  function update() {
    // Safety checks
    if (!game?.scale || !doroSprite?.body) return;
    
    // Get positioning metrics
    const canvas = game.scale.canvas;
    const scale = game.scale.displayScale;
    const offset = game.scale.displayBounds;
    
    // Get doro position
    const bounds = doroSprite.getBounds();
    const doroBottom = (bounds.y + bounds.height) * scale.y + offset.y;
    
    // Position score display
    const scoreContainer = document.getElementById('score-display-container');
    if (scoreContainer) {
      scoreContainer.style.top = `${doroBottom + 20}px`;
      scoreContainer.style.left = `${bounds.centerX * scale.x + offset.x}px`;
    }
  }
  
  // ... rest of existing code ...
  
  function updateUI() {
    document.getElementById('score-display').textContent = 
      `Doros: ${gameState.doros.toDecimalPlaces(2)}`;
  
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
      gameState.doros = gameState.doros.minus(gameState.autoClickerCost);
      gameState.autoClickerCount += 1;
      gameState.autoClickerCost = gameState.autoClickerCost.times(1.15).ceil();
      updateUI();
    }
  };
  
  window.purchaseClickMultiplier = () => {
    if (gameState.doros.gte(gameState.multiplierCost)) {
      gameState.doros = gameState.doros.minus(gameState.multiplierCost);
      gameState.clickMultiplier = gameState.clickMultiplier.times(1.5);
      gameState.multiplierCost = gameState.multiplierCost.times(2.5).ceil();
      updateUI();
    }
  };
  
  new Phaser.Game(config);