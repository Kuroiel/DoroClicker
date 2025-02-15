const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const portfinder = require('portfinder');
const { exec } = require('child_process');

describe('Score Updates', function() {
  let driver;
  let server;
  
  before(async function() {
    const port = await portfinder.getPortPromise();
    process.env.PORT = port;
    server = exec('npm run dev');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    
    await driver.get(`http://localhost:${port}`);
  });

  after(async function() {
    await driver.quit();
    server.kill();
  });

  it('should increment score when clicking doro', async function() {
    const initialScore = await driver.findElement(By.css('.score-display')).getText();
    
    // Click the game canvas at coordinates where doro exists
    const canvas = await driver.findElement(By.css('canvas'));
    const actions = driver.actions({ async: true });
    await actions.move({ origin: canvas, x: 400, y: 100 }).click().perform();
    
    await driver.wait(until.elementTextMatches(
      By.css('.score-display'),
      /Doros: 1.00/),
      5000
    );
  });
});