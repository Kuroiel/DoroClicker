const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');
const portfinder = require('portfinder');

(async function runE2eTests() {
  const port = await portfinder.getPortPromise();
  const server = http.createServer({ root: '.' });
  
  await new Promise((resolve, reject) => {
    server.listen(port, (err) => err ? reject(err) : resolve());
  });

  const options = new chrome.Options().addArguments(
    '--headless=new', // Updated headless mode
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1280,720'
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(`http://localhost:${port}`);
    
    // Wait for game initialization
    await driver.wait(until.elementLocated(By.css('canvas')), 15000);
    
    // Get score through DOM element
    const scoreElement = await driver.wait(until.elementLocated(By.id('score-text')), 10000);
    const initialScore = parseInt(await scoreElement.getText());
    
    // Click using coordinates relative to canvas
    const canvas = await driver.findElement(By.css('canvas'));
    const canvasLocation = await canvas.getRect();
    await driver.actions()
      .move({ 
        origin: canvas,
        x: canvasLocation.width / 2,
        y: canvasLocation.height / 2
      })
      .click()
      .perform();

    // Verify score increment
    await driver.wait(async () => {
      const newScore = parseInt(await scoreElement.getText());
      return newScore === initialScore + 1;
    }, 10000);
    
    console.log('✅ E2E tests passed');
  } catch (error) {
    console.error('❌ E2E tests failed:', error);
    process.exit(1);
  } finally {
    await driver.quit();
    server.close();
  }
})();