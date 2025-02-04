// Game State
let doros = 0;
let autoClickerCost = 10;
let clickMultiplierCost = 50;
let autoClickerInterval;
let clickMultiplier = 1;

// DOM Elements
const scoreElement = document.getElementById('score');
const doroButton = document.getElementById('doro');
const autoClickerButton = document.getElementById('auto-clicker');
const clickMultiplierButton = document.getElementById('click-multiplier');

// Update the score display
function updateScore() {
  scoreElement.textContent = `Doros: ${doros}`;
}

// Handle doro click
doroButton.addEventListener('click', () => {
  doros += clickMultiplier;
  updateScore();
  checkUpgrades();
});

// Buy Auto  Clicker
function buyAutoClicker() {
  if (doros >= autoClickerCost) {
    doros -= autoClickerCost;
    autoClickerCost *= 2;
    autoClickerButton.querySelector('.upgrade-cost').textContent = `Cost: ${autoClickerCost} Doros`;
    updateScore();
    startAutoClicker();
    checkUpgrades();
  }
}

autoClickerButton.addEventListener('click', buyAutoClicker);

// Buy Click Multiplier
function buyClickMultiplier() {
  if (doros >= clickMultiplierCost) {
    doros -= clickMultiplierCost;
    clickMultiplierCost *= 2;
    clickMultiplierButton.querySelector('.upgrade-cost').textContent = `Cost: ${clickMultiplierCost} Doros`;
    updateScore();
    checkUpgrades();
  }
}

clickMultiplierButton.addEventListener('click', buyClickMultiplier);

// Start Auto Clicker
function startAutoClicker() {
  if (autoClickerInterval) return; // Prevent multiple intervals
  autoClickerInterval = setInterval(() => {
    doros += clickMultiplier;
    updateScore();
  }, 1000); // 1 second interval
}

// Check if upgrades can be afforded
function checkUpgrades() {
  autoClickerButton.disabled = doros < autoClickerCost;
  clickMultiplierButton.disabled = doros < clickMultiplierCost;
}

// Initialize
updateScore();
checkUpgrades();