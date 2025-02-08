const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');
const portfinder = require('portfinder');

(async function runE2eTests() {
  // Find available port
  const port = await portfinder.getPortPromise();
  const server = http.createServer({ root: '.' });
  
  // Start server with dynamic port
  await new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Fixed Chrome options configuration
  const options = new chrome.Options().addArguments(
    '--headless',
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
    const canvas = await driver.wait(until.elementLocated(By.css('canvas')), 5000);
    
    // Get initial score
    const initialText = await canvas.getText();
    const initialScore = parseInt(initialText.match(/Doros: (\d+)/)[1]);
    
    // Click center of canvas
    await driver.actions()
      .move({ origin: canvas })
      .click()
      .perform();
    
    // Verify score increment
    await driver.wait(async () => {
      const newText = await canvas.getText();
      return parseInt(newText.match(/Doros: (\d+)/)[1]) === initialScore + 1;
    }, 5000);
    
    console.log('✅ E2E tests passed');
  } catch (error) {
    console.error('❌ E2E tests failed:', error);
    process.exit(1);
  } finally {
    await driver.quit();
    server.close();
  }
})();