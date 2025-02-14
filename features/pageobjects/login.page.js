const { $, browser } = require("@wdio/globals");
const Page = require("./page");
const utils = require("../../utils/utils");
const allure = require("@wdio/allure-reporter");
/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  get inputUsername() {
    return $("//input[@name='email' and @type='email']");
  }

  get inputPassword() {
    return $("//input[@name='password' and @type='password']");
  }

  get btnSubmit() {
    return $("//button[@id = 'submitBTN']");
  }

  get btnLogo(){
    return $(`//header/div/div/a[contains(@class,'fadeout')]`)
  }

  async selectMenuName(text) {
    return $(`//button[./span[text()='${text}']]`);

  }


  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  async login(username, password) {
    let retries = 10;

    while (retries-- > 0 && !(await this.inputUsername.isDisplayed())) {
      await browser.url('https://phptravels.net/login');
    }

    expect(await this.inputUsername.isDisplayed()).toBe(true);
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }
  async selectMenu(menuName){
    
    await allure.addStep(`Select menu ${menuName}`);
    console.log(`Select menu ${menuName}`)
    await this.btnLogo.waitForExist({ timeout: 10000 });
    await this.btnLogo.click()
    await this.selectMenu(menuName)
    await this.selectMenu.waitForExist({ timeout: 5000 });
    await this.selectMenu.waitForDisplayed({ timeout: 5000 });
    console.log(`button menu ${menuName} appears`)
    await utils.takeScreenshotWithHighlight(menuElement.$,"highlighted_menu");
    await menuElement.click();
    await browser.pause(5000)

  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open("login");
  }
}

module.exports = new LoginPage();
