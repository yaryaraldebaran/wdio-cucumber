const { $ } = require("@wdio/globals");
const Page = require("../features/pageobjects/page");
const { addAttachment } = require('@wdio/allure-reporter');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class Utils extends Page {
  /**
   * define selectors using getter methods
   */
  get flashAlert() {
    return $("#flash");
  }

  // Fungsi untuk mengambil screenshot manual
  async customTakeScreenshot() {
    const screenshot = await browser.takeScreenshot();
    addAttachment(
      'Screenshot_' + new Date().toISOString(),
      Buffer.from(screenshot, "base64"),
      "image/png"
    );
  }
}

module.exports = new Utils();
