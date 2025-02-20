import { $, browser } from "@wdio/globals";
import Page from "./page";
import utils from "../../utils/utils";
import allure from "@wdio/allure-reporter";
import chalk from "chalk";
import type { ChainablePromiseElement } from "webdriverio";
import { expect } from "expect-webdriverio";

class LoginPage extends Page {
  /**
   * element
   */
  get inputUsername(): ChainablePromiseElement {
    return $("//input[@name='email' and @type='email']");
  }

  get inputPassword(): ChainablePromiseElement {
    return $("//input[@name='password' and @type='password']");
  }

  get btnSubmit(): ChainablePromiseElement {
    return $("//button[@id='submitBTN']");
  }

  get btnLogo(): ChainablePromiseElement {
    return $("//header/div/div/a[contains(@class,'fadeout')]");
  }

  selectMenuName(text: string): ChainablePromiseElement {
    return $(`//button[./span[text()='${text}']]`);
  }

  async login(username: string, password: string): Promise<void> {
    await browser.url("https://phptravels.net/login");

    await this.inputUsername.waitForDisplayed({ timeout: 10000 });
    await expect(this.inputUsername).toBeDisplayed();

    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.waitForClickable({ timeout: 5000 });
    await this.btnSubmit.click();
  }

  async selectMenu(menuName: string): Promise<void> {
    allure.addStep(`Select menu ${menuName}`);

    await this.btnLogo.waitForClickable({ timeout: 15000 });
    await this.btnLogo.click();

    const selectedMenu = this.selectMenuName(menuName);
    await selectedMenu.waitForClickable({ timeout: 15000 });
    await selectedMenu.click();

    console.log(chalk.grey(`button menu ${menuName} appears`));

    // await utils.takeScreenshotWithHighlight(selectedMenu, "highlighted_menu");
  }

  open(path: string = "login"): Promise<void> {
    return super.open(path);
  }
}

export default new LoginPage();
