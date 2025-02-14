const { $ } = require("@wdio/globals");
const Page = require("../features/pageobjects/page");
const report = require("@wdio/allure-reporter");
const { addAttachment } = require("@wdio/allure-reporter");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class Utils {
  /**
   * Generate a screenshot name based on the current date and time or a custom name.
   * @param {string|null} name - Custom name for the screenshot. If null, generate a name using the current date and time.
   * @returns {string} - The generated screenshot name.
   */
  getScreenshotName(name = null) {
    if (!name || name.trim() === "") {
      const now = new Date();
      const formattedDate = now
        .toISOString()
        .replace(/[-:.]/g, "")
        .slice(0, 15);
      return `screenshot_${formattedDate}.png`;
    }
    return `${name}.png`;
  }

  /**
   * Capture a screenshot and attach it to the Allure report.
   * @param {string|null} name - Custom name for the screenshot. If null, a name will be generated.
   */
  async takeScreenshot(element=null,param = null) {
    const screenshotName = this.getScreenshotName(param);
  
    // Define the screenshot path
    const screenshotPath = path.join(
      process.cwd(),
      "screenshots",
      screenshotName
    );
  
    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(screenshotPath))) {
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    }
  
    // Capture the screenshot using browser.saveScreenshot
    await browser.saveScreenshot(screenshotPath);
    // Read the screenshot file
    const screenshotData = fs.readFileSync(screenshotPath);
  
    // Add a nested step with the screenshot attached
    report.startStep(`Step: ${screenshotName}`);
    report.addAttachment("Screenshot", screenshotData, "image/png");
    report.endStep();
  }
  
  

  /**
   * define selectors using getter methods
   */
  get flashAlert() {
    return $("#flash");
  }

  async takeScreenshotWithHighlight(element = null, param = "screenshot") {
    if (!element) {
      throw new Error("Element is required for highlighting in screenshot");
    }

    // Wait for the element to be present and visible
    await element.waitForExist({ timeout: 5000 });
    await element.waitForDisplayed({ timeout: 5000 });

    // Get element's position and size
    const { x, y } = await element.getLocation();
    const { width, height } = await element.getSize();

    // Define screenshot paths
    const screenshotName = `${param}.png`;
    const screenshotsDir = path.join(process.cwd(), "screenshots");
    const screenshotPath = path.join(screenshotsDir, screenshotName);
    const highlightedPath = path.join(screenshotsDir, `highlighted_${screenshotName}`);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Capture screenshot
    await browser.saveScreenshot(screenshotPath);

    // Process with Sharp
    const image = sharp(screenshotPath);
    const metadata = await image.metadata();

    // Draw red rectangle overlay
    const overlay = Buffer.from(`
      <svg width="${metadata.width}" height="${metadata.height}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" 
              fill="none" stroke="red" stroke-width="4"/>
      </svg>
    `);

    // Apply overlay and save
    await image.composite([{ input: overlay, top: 0, left: 0 }]).toFile(highlightedPath);

    // Convert final image to Base64
    const finalScreenshotBase64 = fs.readFileSync(highlightedPath).toString("base64");

    // Attach screenshot to Allure (DO NOT use startStep/endStep)
    report.addAttachment("Highlighted Screenshot", Buffer.from(finalScreenshotBase64, "base64"), "image/png");
  }

  /**
   * Waits for the page to be fully loaded.
   */
  async waitForPageLoaded(timeout = 120000) {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => document.readyState);
        return readyState === "complete";
      },
      {
        timeout,
        timeoutMsg: "Page did not load completely within the specified timeout",
      }
    );
  }
}

module.exports = new Utils();
