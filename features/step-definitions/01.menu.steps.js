const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $ } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

When(/^I login with (.+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password);
});


Then(/^I open the "(.*)" menu$/, async (menuName) => {
    // Locate the menu item by its name (menuName) and perform the click action
    const menuSelector = `//a[contains(text(), '${menuName}')]`; // Adjust selector based on your DOM
    const menuElement = await $(menuSelector);
    await menuElement.click();
});

