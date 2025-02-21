import { Given, When, Then } from "@wdio/cucumber-framework";
import { expect, $, browser } from "@wdio/globals";
import HotelsPage  from "../pageobjects/hotels.page";
import LoginPage from "../pageobjects/login.page";
import report from "@wdio/allure-reporter";
import Page from "../pageobjects/page";
import GlobalVariables from "../../utils/globalVariables";
import HandleElement from "../../utils/handleElement";

const pages: Record<string, Page> = {
  login: LoginPage,
};
const page = new Page()
const hotelsPage = new HotelsPage()


Then(/^User search city \"(.*)\"$/, async (cityName: string) => {
  await hotelsPage.searchHotel(cityName);
  
});

Then(/^User click hotel \"(.*)\" card$/, async (hotelName: string) => {
  await hotelsPage.selectHotel(hotelName);
});

Then(/^User see \"(.*)\" city in result card$/, async (cityName: string) => {
  await hotelsPage.verifyCityInSearchLocation(cityName);
});

Given(/^User have searched for hotels in \"(.*)\"$/, async (cityName: string) => {
  await LoginPage.login("user@phptravels.com", "demouser");
  await LoginPage.selectMenu("Hotels");
  await browser.pause(5000);
  await hotelsPage.searchHotel(cityName);
  await hotelsPage.verifyCityInSearchLocation(cityName);
});

When(/^User select card hotel \"(.*)\"$/, async (hotelName: string) => {
  await hotelsPage.selectHotel(hotelName);
});

When(/^User create hotel booking for \"(.*)\" night and \"(.*)\" type$/, async (night: string, roomType: string) => {
  const btnSelectRoom = await hotelsPage.btnSelectRoom;
  await btnSelectRoom.click();
  await HandleElement.scrollToElement(await hotelsPage.dropdownOnDetail);
  await hotelsPage.selectDropdown(
    await hotelsPage.dropdownOnDetail,
    await hotelsPage.optionByTextOnDetail(`${night} -`)
  );
  await HandleElement.scrollToElement(await hotelsPage.btnBookByRoomType(roomType));
  await (await hotelsPage.btnBookByRoomType(roomType)).click();
});

When(/^Registered User continue finishing transaction$/, async () => {
  await hotelsPage.fillHotelBookingInformation(true);
});

When(/^Non-Registered User continue finishing transaction$/, async () => {
  await hotelsPage.fillHotelBookingInformation(false);
});

When(/^User have the transaction id$/, async () => {
  await hotelsPage.verifyTrxDetailAfterBooking();
});

Given(/^User have searched for hotels in \"(.*)\" without login$/, async (cityName: string) => {
  await page.open("");
  const menuSelector = "//button[./span[text()='Hotels']]";
  const menuElement = await $(menuSelector);
  await menuElement.click();
  await browser.pause(5000);
  await hotelsPage.searchHotel(cityName);
  await hotelsPage.verifyCityInSearchLocation(cityName);
});

When(/^User cancel the book$/, async () => {
  console.log(GlobalVariables.getVariable("bookingReference"));
  await (await hotelsPage.btnByText("Request for Cancellation")).scrollIntoView();
  await (await hotelsPage.btnByText("Request for Cancellation")).click();
});
