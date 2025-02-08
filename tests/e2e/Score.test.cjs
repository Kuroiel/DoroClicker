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

  const options = new chrome.Options()
    .headless()
    .addArguments('--no-sandbox', '--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(`http://localhost:${port}`);
    const canvas = await driver.wait(until.elementLocated(By.css('canvas')), 5000);
    
    // Test logic here
    const initialText = await canvas.getText();
    const initialScore = parseInt(initialText.match(/Doros: (\d+)/)[1]);
    
    await driver.actions().click(canvas).perform();
    
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