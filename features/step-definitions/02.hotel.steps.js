const { Given, When, Then } = require("@wdio/cucumber-framework");
const { expect, $, browser } = require("@wdio/globals");
const hotelsPage = require("../pageobjects/hotels.page");
const LoginPage = require("../pageobjects/login.page");
const report = require("@wdio/allure-reporter");
const Page = require("../pageobjects/page");
const GlobalVariables = require("../../utils/globalVariables");

const HandleElement = require("../../utils/handleElement");
const page = new Page();
const pages = {
  login: LoginPage,
};



/**
 * Cucumber Steps Definition
 */

Then(/^User search city "(.*)"$/, async (cityName) => {
  await hotelsPage.searchHotel(cityName);
});
Then(/^User click hotel "(.*)" card$/, async (hotelName) => {
  await hotelsPage.selectHotel(hotelName);
});

Then(/^User see "(.*)" city in result card$/, async (cityName) => {
  await hotelsPage.verifyCityInSearchLocation(cityName);
});

Given(/^User have searched for hotels in "(.*)"$/, async (cityName) => {
  await pages["login"].open();
  await LoginPage.login("user@phptravels.com", "demouser");
  const menuSelector = `//a[contains(text(), 'Hotels')]`;
  const menuElement = await $(menuSelector);
  await menuElement.doubleClick();
  await browser.pause(5000);

  await hotelsPage.searchHotel(cityName);
  await hotelsPage.verifyCityInSearchLocation(cityName);
});

When(/^User select card hotel "(.*)"$/, async (hotelName) => {
  await selectHotel(hotelName);
});

When(
  /^User create hotel booking for "(.*)" night and "(.*)" type$/,
  async (night, roomType) => {
    const btnSelectRoom = await hotelsPage.btnSelectRoom;
    await btnSelectRoom.click();
    await HandleElement.scrollToElement(await hotelsPage.dropdownOnDetail);
    await selectDropdown(
      await hotelsPage.dropdownOnDetail,
      await hotelsPage.optionByTextOnDetail(`${night} -`)
    );
    await HandleElement.scrollToElement(
      await hotelsPage.btnBookByRoomType(roomType)
    );
    await utils.takeScreenshot();
    await (await hotelsPage.btnBookByRoomType(roomType)).click();
  }
);

When(/^Registered User continue finishing transaction$/, async () => {
  await hotelsPage.fillHotelBookingInformation((isRegistered = true));
});

When(/^Non-Registered User continue finishing transaction$/, async () => {
  await hotelsPage.fillHotelBookingInformation((isRegistered = false));
});

When(/^User have the transaction id$/, async () => {
  await hotelsPage.verifyTrxDetailAfterBooking();
});

Given(
  /^User have searched for hotels in "(.*)" without login$/,
  async (cityName) => {
    // Write code here that turns the phrase above into concrete actions
    await page.open("");
    await utils.takeScreenshot();
    const menuSelector = `//button[./span[text()='Hotels']]`;
    const menuElement = await $(menuSelector);
    await utils.takeScreenshot();
    await menuElement.click();
    await browser.pause(5000);
    await utils.takeScreenshot();
    await searchHotel(cityName);
    await verifyCityInSearchLocation(cityName);
  }
);

When(/^User cancel the book$/, async () => {
  await console.log(GlobalVariables.getVariable("bookingReference"));
  //scrollto button request for cancellation
  await (
    await hotelsPage.btnByText("Request for Cancellation")
  ).scrollIntoView();
  await (await hotelsPage.btnByText("Request for Cancellation")).click();

});

