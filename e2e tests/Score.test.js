import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

describe('Doro Clicker E2E Tests', () => {
  let driver;
  let server;

  beforeAll(async () => {
    // Start local server
    const { default: httpServer } = await import('http-server');
    server = httpServer.createServer({ root: '.' });
    await new Promise(resolve => server.listen(8080, resolve));

    // Configure Chrome options
    const options = new chrome.Options()
      .headless() // Remove this line to see browser window
      .windowSize({ width: 1280, height: 720 });

    // Initialize WebDriver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
    await new Promise(resolve => server.close(resolve));
  });

  test('Should increment score when clicking doro', async () => {
    await driver.get('http://localhost:8080');
    
    // Wait for game to load
    await driver.wait(until.elementLocated(By.id('game-container')), 5000);
    
    // Get initial score
    const initialScore = await driver.findElement(By.css('canvas'))
      .getText()
      .then(text => parseInt(text.match(/Doros: (\d+)/)[1]));
    
    // Click doro image
    const doroButton = await driver.findElement(By.css('canvas'));
    await driver.actions().move({ origin: doroButton }).click().perform();
    
    // Verify score increment
    await driver.wait(async () => {
      const newScore = await driver.findElement(By.css('canvas'))
        .getText()
        .then(text => parseInt(text.match(/Doros: (\d+)/)[1]));
      return newScore === initialScore + 1;
    }, 5000);
  }, 10000);
});