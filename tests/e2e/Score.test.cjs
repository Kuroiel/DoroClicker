const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');
const portfinder = require('portfinder');

describe('Doro Clicker E2E Tests', function() {
  this.timeout(30000);
  let server;
  let driver;
  let port;

  before(async () => {
    // Find available port
    port = await portfinder.getPortPromise();
    
    // Start HTTP server
    server = http.createServer({
      port: port,
      root: './' // Path to your web files
    });
    await new Promise(resolve => server.listen(port, resolve));

    // Configure Chrome driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments(
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ))
      .build();
  });

  after(async () => {
    await driver.quit();
    await new Promise(resolve => server.close(resolve));
  });

  it('should verify game score', async () => {
    await driver.get(`http://localhost:${port}`);
    // Your test logic here
    const scoreElement = await driver.wait(until.elementLocated(By.id('score')), 5000);
    const score = await scoreElement.getText();
    if (parseInt(score) !== 0) {
      throw new Error('Initial score not zero');
    }
  });
});