const { Given, When, Then } = require("@wdio/cucumber-framework");
const { expect, $, browser } = require("@wdio/globals");
const hotelsPage = require("../pageobjects/hotels.page");
const LoginPage = require("../pageobjects/login.page");
const utils = require("../../utils/utils");
const Page = require("../pageobjects/page");
const GlobalVariables = require('../../utils/globalVariables')
const report = require('@wdio/allure-reporter')

const page = new Page(); 
const pages = {
  login: LoginPage,
};
// const hotelsPage = new HotelsPage()
const searchHotel = async (cityName) => {
  console.log("Now search hotel");

  await browser.pause(4000);
  // const searchSelect = hotelsPage.searchSelector
  await hotelsPage.searchSelector.click();

  // const searchField = hotelsPage.searchField
  await hotelsPage.searchField.setValue(cityName);
  await utils.customTakeScreenshot();
  await browser.pause(2000);

  // const firstResult = hotelsPage.firstResult
  await hotelsPage.firstResult.click();
  await hotelsPage.buttonSearch.click();
  await browser.pause(10000);
  await utils.customTakeScreenshot();
};
const selectHotel = async (hotelName) => {
  // const txtGetApp = await $("//strong[normalize-space()='Get The App!']")
  // await txtGetApp.scrollIntoView()
  const btnHide = await $("//button[text()='Hide']");
  if (await btnHide.isExisting() && await btnHide.isDisplayed()){
    await btnHide.click();
  }
  
  const btnView = await hotelsPage.btnViewByHotelName(hotelName);
  await btnView.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Element not displayed",
  });
  await btnView.scrollIntoView();
  await btnView.click();

  var hotelNameInDetail = await hotelsPage.txtHotelNameinDetail.getText();
  await expect(hotelNameInDetail).toEqual(hotelName);
  await utils.customTakeScreenshot();
};
const verifyCityInSearchLocation = async (cityName) => {
  const cityNameOnCard = await hotelsPage.txtHotelLocation(cityName);
  for (const element of cityNameOnCard) {
    expect(await element.isDisplayed()).toBe(true);
  }
  await utils.customTakeScreenshot();
};

const selectDropdown = async (dropdown, option) => {
  const dropdownElement = await dropdown;
  await dropdownElement.click();
  const optionElement = await option;
  await optionElement.click();
};
const fillPersonalInformation = async () => {
  await (
    await hotelsPage.inputPersonalInfoByLabelDynamic("First Name")
  ).setValue("John");
  await (
    await hotelsPage.inputPersonalInfoByLabelDynamic("Last Name")
  ).setValue("Doe");
  await (
    await hotelsPage.inputPersonalInfoByLabelDynamic("Email")
  ).setValue("john@doe.com");
  await (
    await hotelsPage.inputPersonalInfoByLabelDynamic("Address")
  ).setValue("John Doe Address");
  await (
    await hotelsPage.inputPersonalInfoByLabelDynamic("Phone")
  ).setValue("088888888");
  await utils.customTakeScreenshot();
};
const fillTravellersInformation = async () => {
  const elements = await hotelsPage.counterTraveller

  elements.forEach(async (element, i) => {
    await selectDropdown(
      await hotelsPage.dropdownTravellerTitlebyOrder(i+1),
      await hotelsPage.optionByTextOnDetail("Mr")
    );
    await (await hotelsPage.inputTravellerFirstNamebyOrder(i+1)).setValue("John");
    await (await hotelsPage.inputTravellerLastNamebyOrder(i+1)).setValue("Doe");  
  });
  
  await report.addStep('input traveller is finished')
};
const fillHotelBookingInformation = async (isRegistered = true) => {
  if (!isRegistered) {
    await fillPersonalInformation();
    await utils.customTakeScreenshot();
  }
  await fillTravellersInformation();
  await report.addStep('now go to TnC')
  await utils.customTakeScreenshot();
  await hotelsPage.radioTnC.scrollIntoView();
  await report.addStep('now take TnC button')
  await utils.customTakeScreenshot();
  await hotelsPage.radioTnC.click()
  
  await (await hotelsPage.btnByText('Booking Confirm')).click()
  await report.addStep('booking confirm')
  await browser.pause(15000)
  

};

const verifyTrxDetailAfterBooking=async ()=>{
    await expect(await hotelsPage.txtTrxDetailStatusByLabel('Payment Status')).toHaveText('unpaid')
    await expect(await hotelsPage.txtTrxDetailStatusByLabel('Booking Status')).toHaveText('pending')
    var bookingReference =  await (await hotelsPage.txtBookingReference).getText()
    await GlobalVariables.setVariable('bookingReference',bookingReference)
    await console.log("global variable test :"+GlobalVariables.getVariable('bookingReference'))
}

/**
 * Cucumber Steps Definition
 */

Then(/^User search city "(.*)"$/, async (cityName) => {
  await searchHotel(cityName);
});
Then(/^User click hotel "(.*)" card$/, async (hotelName) => {
  await selectHotel(hotelName);
});

Then(/^User see "(.*)" city in result card$/, async (cityName) => {
  await verifyCityInSearchLocation(cityName);
});

Given(/^User have searched for hotels in "(.*)"$/, async (cityName) => {
  await pages["login"].open();
  await LoginPage.login("user@phptravels.com", "demouser");
  const menuSelector = `//a[contains(text(), 'Hotels')]`;
  const menuElement = await $(menuSelector);
  await menuElement.click();
  await browser.pause(5000);

  await searchHotel(cityName);
  await verifyCityInSearchLocation(cityName);
});

When(/^User select card hotel "(.*)"$/, async (hotelName) => {
  await selectHotel(hotelName);
});

When(/^User create hotel booking for "(.*)" night and "(.*)" type$/, async (night,roomType) => {
  const btnSelectRoom = await hotelsPage.btnSelectRoom;
  await btnSelectRoom.click();
  await selectDropdown(
    await hotelsPage.dropdownOnDetail,
    await hotelsPage.optionByTextOnDetail(`${night} -`)
  );
  // const btnBookNow = hotelsPage.btnBookNow;
  //add select
  await (await hotelsPage.btnBookByRoomType(roomType)).scrollIntoView();
  await utils.customTakeScreenshot()
  await (await hotelsPage.btnBookByRoomType(roomType)).click();
});

When(/^Registered User continue finishing transaction$/, async () => {
  await fillHotelBookingInformation(isRegistered = true);
});

When(/^Non-Registered User continue finishing transaction$/, async () => {
  await fillHotelBookingInformation(isRegistered = false);
});

When(/^User have the transaction id$/, async () => {
    await verifyTrxDetailAfterBooking()
});

Given(
  /^User have searched for hotels in "(.*)" without login$/,
  async (cityName) => {
    // Write code here that turns the phrase above into concrete actions
    await page.open("");
    await utils.customTakeScreenshot();
    const menuSelector = `//a[contains(text(), 'Hotels')]`;
    const menuElement = await $(menuSelector);
    await utils.customTakeScreenshot();
    await menuElement.click();
    await browser.pause(5000);
    await utils.customTakeScreenshot();
    await searchHotel(cityName);
    await verifyCityInSearchLocation(cityName);
  }
);

When(/^User cancel the book$/, async () => {
  await console.log(GlobalVariables.getVariable('bookingReference'))
  //scrollto button request for cancellation
  await (await hotelsPage.btnByText("Request for Cancellation")).scrollIntoView();
  await (await hotelsPage.btnByText("Request for Cancellation")).click();
});

Given(/^User have booking cancellation$/, async (cityName) => {});
