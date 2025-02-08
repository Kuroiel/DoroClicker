const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Doro Clicker E2E Tests', () => {
  let driver;
  
  beforeAll(async () => {
    const options = new chrome.Options()
      .headless()
      .addArguments('--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    await driver.quit();
  });

  test('Score increments on click', async () => {
    // Start HTTP server in background
    const http = require('http-server');
    const server = http.createServer({ root: '.' });
    await new Promise(resolve => server.listen(8080, resolve));

    try {
      await driver.get('http://localhost:8080');
      const canvas = await driver.wait(until.elementLocated(By.css('canvas')), 5000);
      
      // Get initial score
      const initialText = await canvas.getText();
      const initialScore = parseInt(initialText.split(': ')[1]);
      
      // Click center of canvas
      await driver.actions()
        .move({ origin: canvas })
        .click()
        .perform();
      
      // Verify increment
      await driver.wait(async () => {
        const newText = await canvas.getText();
        return parseInt(newText.split(': ')[1]) === initialScore + 1;
      }, 5000);
    } finally {
      server.close();
    }
  }, 15000);
});