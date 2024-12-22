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
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Ganti karakter tidak valid
    const fileName = `Screenshot_${timestamp}.png`;

    // Tambahkan ke laporan Allure
    addAttachment(fileName, Buffer.from(screenshot, "base64"), "image/png");
  }

  }
  

module.exports = new Utils();
