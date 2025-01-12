const { $ } = require("@wdio/globals");
const Page = require("../features/pageobjects/page");
const report = require("@wdio/allure-reporter");
const { addAttachment } = require("@wdio/allure-reporter");
const fs = require("fs");
const path = require("path");

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
  async takeScreenshot(param = null) {
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

  // Fungsi untuk mengambil screenshot manual
  async customTakeScreenshot() {
    const screenshot = await browser.takeScreenshot();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Ganti karakter tidak valid
    const fileName = `Screenshot_${timestamp}.png`;

    // Tambahkan ke laporan Allure
    addAttachment(fileName, Buffer.from(screenshot, "base64"), "image/png");
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
