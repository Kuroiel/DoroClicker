let cookies = 0;
let autoClickerCost = 10;
let clickMultiplierCost = 50;
let autoClickerInterval;
let clickMultiplier = 1;

// DOM Elements
const scoreElement = document.getElementById('score');
const cookieButton = document.getElementById('cookie');
const autoClickerButton = document.getElementById('auto-clicker');
const clickMultiplierButton = document.getElementById('click-multiplier');

// Update the score display
function updateScore() {
  scoreElement.textContent = `Cookies: ${cookies}`;
}

// Handle cookie click
cookieButton.addEventListener('click', () => {
  cookies += clickMultiplier;
  updateScore();
  checkUpgrades();
});

// Buy Auto Clicker
autoClickerButton.addEventListener('click', () => {
  if (cookies >= autoClickerCost) {
    cookies -= autoClickerCost;
    autoClickerCost *= 2; // Increase cost for next purchase
    autoClickerButton.textContent = `Auto Clicker (Cost: ${autoClickerCost} cookies)`;
    updateScore();
    startAutoClicker();
    checkUpgrades();
  }
});

// Buy Click Multiplier
clickMultiplierButton.addEventListener('click', () => {
  if (cookies >= clickMultiplierCost) {
    cookies -= clickMultiplierCost;
    clickMultiplierCost *= 2; // Increase cost for next purchase
    clickMultiplier *= 2; // Double the multiplier
    clickMultiplierButton.textContent = `Click Multiplier (Cost: ${clickMultiplierCost} cookies)`;
    updateScore();
    checkUpgrades();
  }
});

// Start Auto Clicker
function startAutoClicker() {
  if (autoClickerInterval) return; // Prevent multiple intervals
  autoClickerInterval = setInterval(() => {
    cookies += clickMultiplier;
    updateScore();
  }, 1000); // 1 second interval
}

// Check if upgrades can be afforded
function checkUpgrades() {
  autoClickerButton.disabled = cookies < autoClickerCost;
  clickMultiplierButton.disabled = cookies < clickMultiplierCost;
}

// Initialize
updateScore();
checkUpgrades();
