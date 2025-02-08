const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');
const portfinder = require('portfinder');

(async function runE2eTests() {
  const port = await portfinder.getPortPromise();
  const server = http.createServer({ root: '.' });
  
  await new Promise((resolve, reject) => {
    server.listen(port, (err) => resolve());
  });

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
    
    // Wait for game to fully load
    await driver.wait(until.elementLocated(By.css('canvas')), 10000);
    await driver.sleep(2000); // Additional load time
    
    // Get score text through DOM element instead of canvas
    const scoreElement = await driver.wait(until.elementLocated(By.css('#score-text')), 5000);
    const initialText = await scoreElement.getText();
    const initialScore = parseInt(initialText.replace('Doros: ', ''));

    // Click canvas
    const canvas = await driver.findElement(By.css('canvas'));
    await driver.actions().click(canvas).perform();

    // Verify score increment
    await driver.wait(async () => {
      const newText = await scoreElement.getText();
      return parseInt(newText.replace('Doros: ', '')) === initialScore + 1;
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