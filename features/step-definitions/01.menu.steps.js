const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const loginPage = require('../pageobjects/login.page');

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
    loginPage.selectMenu(menuName)
});

Given(/^User logged in as (.+) with password (.+)$/,async(username,password)=>{
    await pages['login'].open()
    await LoginPage.login(username, password);  
})

Given(/^User is on the dashboard page$/,async()=>{
    console.log("write code here to verify dashboard")
})