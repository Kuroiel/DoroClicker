const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http-server');
const portfinder = require('portfinder');

describe('Doro Clicker E2E Tests', function() {
  this.timeout(40000); // Increased timeout
  let server;
  let driver;
  let port;

  before(async () => {
    try {
      port = await portfinder.getPortPromise();
      
      // Start HTTP server
      server = http.createServer({
        port: port,
        root: './'
      });
      await new Promise((resolve, reject) => {
        server.listen(port, resolve);
        server.on('error', reject);
      });

      // Configure Chrome driver
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options()
          .addArguments(
            '--headless=new', // Use new headless mode
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          )
        )
        .build();
        
      await driver.manage().setTimeouts({ implicit: 5000 });

    } catch (error) {
      console.error('Setup failed:', error);
      if (server) server.close();
      throw error;
    }
  });

  after(async () => {
    try {
      if (driver) {
        await driver.quit();
      }
      if (server) {
        await new Promise(resolve => server.close(resolve));
      }
    } catch (error) {
      console.error('Teardown error:', error);
    }
  });

  it('should verify game score', async () => {
    await driver.get(`http://localhost:${port}`);
    const scoreElement = await driver.wait(until.elementLocated(By.id('score')), 10000);
    const score = await scoreElement.getText();
    if (parseInt(score) !== 0) {
      throw new Error(`Expected score 0, got ${score}`);
    }
  });
});