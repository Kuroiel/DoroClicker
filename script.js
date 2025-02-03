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

// Handle cookie click
doroButton.addEventListener('click', () => {
  doros += clickMultiplier;
  updateScore();
  checkUpgrades();
});

// Buy Auto Clicker
autoClickerButton.addEventListener('click', () => {
  if (doros >= autoClickerCost) {
    doros -= autoClickerCost;
    autoClickerCost *= 2; // Increase cost for next purchase
    autoClickerButton.textContent = `Auto Clicker (Cost: ${autoClickerCost} doros)`;
    updateScore();
    startAutoClicker();
    checkUpgrades();
  }
});

// Buy Click Multiplier
clickMultiplierButton.addEventListener('click', () => {
  if (doros >= clickMultiplierCost) {
    doros -= clickMultiplierCost;
    clickMultiplierCost *= 2; // Increase cost for next purchase
    clickMultiplier *= 2; // Double the multiplier
    clickMultiplierButton.textContent = `Click Multiplier (Cost: ${clickMultiplierCost} doros)`;
    updateScore();
    checkUpgrades();
  }
});

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
