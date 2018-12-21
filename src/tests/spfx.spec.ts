import * as puppeteer from 'puppeteer';
import * as spauth from 'node-sp-auth';

describe('Tests on a site page (not news)', () => {
  let browser: puppeteer.Browser = null;
  let page: puppeteer.Page = null;
  
  /**
   * Create the browser and page context
   */
  beforeAll(async () => {
    const { USERNAME: username, PASSWORD: password, PAGEURL: pageUrl } = process.env;
    
    // Connect to SharePoint
    const data  = await spauth.getAuth(pageUrl, {
      username,
      password
    });

    browser = await puppeteer.launch();
    page = await browser.newPage();
    // Add the authentication headers
    await page.setExtraHTTPHeaders(data.headers);
    // Set default viewport
    await page.setViewport({
      height: 2500,
      width: 1200
    });

    // Open the page
    await page.goto(pageUrl, {
      waitUntil: 'networkidle0'
    });
  }, 30000);

  /**
   * Things to do after all tests are completed
   */
  afterAll(() => {
    browser.close();
  });

  /**
   * Checks if the page is loaded successfully
   * 
   * 30 seconds timeout
   */
  test('Should load the page', async () => {
    expect(page).not.toBeNull();
    expect(await page.title()).not.toBeNull();
    expect(await page.title()).toBe("Automated UI Tests - Home");
  });

  /**
   * Start of the other page tests
   */
  test('Check if caption element is present in the web part', async () => {
    const caption = await page.$('div[data-ui-test-id="caption"]');
    expect(caption).not.toBeNull();

    const captionTitle = await caption.$('p[data-ui-test-id="caption-title"]');
    expect(captionTitle).not.toBeNull();
  });

  /**
   * Check the text in elements
   */
  test('Check if caption text is equal to "Automated UI Tests"', async () => {
    const captionText = await page.evaluate(() => document.querySelector('p[data-ui-test-id="caption-title"]').textContent);
    expect(captionText).toBe("Automated UI Tests");
  });
});