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
      create: create
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    }
  };
  
  let doroSprite;
  let scoreDisplay;
  
  function preload() {
    this.load.image('doro', 'assets/doro.png');
  }
  
  function create() {
    // Create doro sprite
    doroSprite = this.add.image(400, 300, 'doro')
      .setInteractive()
      .setScale(0.18)
      .on('pointerdown', () => {
        gameState.doros = gameState.doros.add(gameState.clickMultiplier);
        updateUI();
      });

      // Create score display
  scoreDisplay = this.add.dom(0, 0).createFromCache('<div id="score-display"></div>');
  updateUI();
  
    // Position score under doro button
    this.scale.on('resize', updateScorePosition);
    updateScorePosition();
  
    // Auto-clicker loop
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        gameState.doros = gameState.doros.add(gameState.autoClickerCount);
        updateUI();
      },
      loop: true
    });
  
    // Initial UI update
    updateUI();
  }

  function updateScorePosition() {
    if (!doroSprite) return;
    
    const bounds = doroSprite.getBounds();
    const scale = game.scale.displayScale;
    const offset = game.scale.displayBounds;
    
    const buttonCenterX = (bounds.x + bounds.width/2) * scale.x + offset.x;
    const buttonBottom = (bounds.y + bounds.height) * scale.y + offset.y;
    
    scoreDisplay.node.style.top = `${buttonBottom + 20}px`;
    scoreDisplay.node.style.left = `${buttonCenterX - scoreDisplay.node.offsetWidth/2}px`;
  }
  
  function updateUI() {
    scoreDisplay.node.textContent = `Doros: ${gameState.doros.toDecimalPlaces(2)}`;
    document.getElementById('score-display').textContent = 
      `Doros: ${gameState.doros.toDecimalPlaces(2).toString()}`;
    
    const autoClickerBtn = document.getElementById('auto-clicker-btn');
    autoClickerBtn.textContent = 
      `Auto Clicker (${gameState.autoClickerCount}) - Cost: ${gameState.autoClickerCost.toFixed()}`;
    autoClickerBtn.disabled = gameState.doros.lt(gameState.autoClickerCost);
  
    const multiplierBtn = document.getElementById('multiplier-btn');
    multiplierBtn.textContent = 
      `Multiplier (x${gameState.clickMultiplier.toFixed(1)}) - Cost: ${gameState.multiplierCost.toFixed()}`;
    multiplierBtn.disabled = gameState.doros.lt(gameState.multiplierCost);
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
  
  // Start the game
  new Phaser.Game(config);

  function update() {
    updateScorePosition();
  }