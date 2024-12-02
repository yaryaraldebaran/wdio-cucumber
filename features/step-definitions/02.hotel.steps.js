const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');



Then(/^I search city "(.*)"$/, async (cityName) => {
    // Locate the menu item by its name (menuName) and perform the click action
    const searchSelector = `//span[@id='select2-hotels_city-container']`; // Adjust selector based on your DOM
    const searchElement = await $(searchSelector);
    await searchElement.click();
    const searchField = await $(`//input[@type='search']`)
    await searchField.setValue("dubai")
    const firstResult = await $(`//li[contains(@class,'select2-results')][1]`)
    await firstResult.click()
    await browser.pause(10000)
});
