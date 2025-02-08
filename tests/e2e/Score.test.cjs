const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');

(async function runE2eTests() {
  // Start server
  const server = http.createServer({ root: '.' });
  await new Promise(resolve => server.listen(8080, resolve));

  // Configure browser
  const options = new chrome.Options()
    .headless()
    .addArguments('--no-sandbox', '--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Test logic
    await driver.get('http://localhost:8080');
    const canvas = await driver.wait(until.elementLocated(By.css('canvas')), 5000);
    
    // Get initial score
    const initialText = await canvas.getText();
    const initialScore = parseInt(initialText.match(/Doros: (\d+)/)[1]);
    
    // Click doro
    await driver.actions().click(canvas).perform();
    
    // Verify score
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