import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';


describe('Doro Clicker E2E Tests', () => {
  let driver;
  let serverProcess;

  beforeAll(async () => {
    // Start HTTP server
    import { exec } from 'child_process';
    serverProcess = exec('npx http-server -p 8080');
    
    // Configure Chrome
    const options = new chrome.Options()
      .headless()
      .windowSize({ width: 1280, height: 720 })
      .addArguments('--no-sandbox');

    // Initialize driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    await driver.quit();
    serverProcess.kill();
  });

  test('Score increments on click', async () => {
    await driver.get('http://localhost:8080');
    
    // Wait for game to load
    const canvas = await driver.wait(until.elementLocated(By.css('canvas')), 10000);
    
    // Get initial score
    const initialText = await canvas.getText();
    const initialScore = parseInt(initialText.match(/Doros: (\d+)/)[1]);
    
    // Click center of canvas
    const actions = driver.actions();
    await actions.move({ origin: canvas }).click().perform();
    
    // Verify score increment
    await driver.wait(async () => {
      const newText = await canvas.getText();
      return parseInt(newText.match(/Doros: (\d+)/)[1]) === initialScore + 1;
    }, 5000);
  }, 15000);
});