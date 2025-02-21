import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, $, browser } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page'; 

// Define a type for the pages object to ensure type safety
type Pages = {
    login: typeof LoginPage;
};

// Define the pages object with type annotation
const pages: Pages = {
    login: LoginPage
};

Given(/^User is on the "(.*)" page$/, async (page: keyof Pages) => {
    await pages[page].open();
});

When(/^User login with (.+) and (.+)$/, async (username: string, password: string) => {
    await LoginPage.login(username, password);
});

Then(/^User open the "(.*)" menu$/, async (menuName: string) => {
    await LoginPage.selectMenu(menuName);
});

Given(/^User logged in as (.+) with password (.+)$/, async (username: string, password: string) => {
    await pages['login'].open();
    await LoginPage.login(username, password);
});

Given(/^User is on the dashboard page$/, async () => {
    console.log("write code here to verify dashboard");
});