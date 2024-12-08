const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

const pages = {
    login: LoginPage
}

Given(/^User is on the "(.*)" page$/, async (page) => {
    await pages[page].open()
});

When(/^User login with (.+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password);
});


Then(/^User open the "(.*)" menu$/, async (menuName) => {
    // Locate the menu item by its name (menuName) and perform the click action
    const menuSelector = `//a[contains(text(), '${menuName}')]`; 
    const menuElement = await $(menuSelector);
    await menuElement.click();
    await browser.pause(5000)
});

Given(/^User logged in as (.+) with password (.+)$/,async(username,password)=>{
    await pages['login'].open()
    await LoginPage.login(username, password);
})

Given(/^User is on the dashboard page$/,async()=>{
    console.log("write code here to verify dashboard")
})