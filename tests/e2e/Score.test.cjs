// e2e test file
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const httpServer = require('http-server');
const portfinder = require('portfinder');

describe('Doro Clicker E2E Tests', function() {
  this.timeout(40000);
  let server;
  let driver;
  let port;

  before(async () => {
    try {
      port = await portfinder.getPortPromise();

      // Start HTTP server with proper initialization
      server = httpServer.createServer({
        root: './',
        cors: true,
        cache: -1  // Disable caching for tests
      });

      // Start server with Promise wrapper
      await new Promise((resolve, reject) => {
        server.server.listen(port, (err) => {
          if (err) return reject(err);
          console.log(`Server running on port ${port}`);
          resolve();
        });
      });

      // Configure Chrome driver
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options()
          .addArguments(
            '--headless=new',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1280,720'
          )
        )
        .build();

    } catch (error) {
      console.error('Test setup failed:', error);
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
        await new Promise(resolve => {
          server.server.close(() => {
            console.log('Server stopped');
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Test teardown error:', error);
    }
  });

    it('should verify initial game score', async () => {
        await driver.get(`http://localhost:${port}`);
        const scoreElement = await driver.wait(
            until.elementLocated(By.id('score-value')), //  Use the correct ID!
            10000
        );
        const score = await scoreElement.getText();
        if (parseInt(score) !== 0) {
          throw new Error(`Expected initial score 0, got ${score}`);
        }
    });
});