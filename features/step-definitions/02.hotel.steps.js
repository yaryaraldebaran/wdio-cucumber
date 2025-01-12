const { Given, When, Then } = require("@wdio/cucumber-framework");
const { expect, $, browser } = require("@wdio/globals");
const hotelsPage = require("../pageobjects/hotels.page");
const LoginPage = require("../pageobjects/login.page");
const utils = require("../../utils/utils");
const Page = require("../pageobjects/page");
const GlobalVariables = require("../../utils/globalVariables");
const report = require("@wdio/allure-reporter");
const HandleElement = require("../../utils/handleElement");
const page = new Page();
const pages = {
  login: LoginPage,
};

const searchHotel = async (cityName) => {
  console.log("Now search hotel");

  await browser.pause(4000);

  await hotelsPage.searchSelector.click();


  await hotelsPage.searchField.setValue(cityName);
  await utils.takeScreenshot("Searching hotel with city filter");
  await browser.pause(2000);


  await hotelsPage.firstResult.click();
  await report.addStep("Click first result city")
  await hotelsPage.buttonSearch.click();
  await browser.pause(10000);
  await utils.takeScreenshot("Hotel's search page displayed");
};
const selectHotel = async (hotelName) => {

  const btnHide = await $("//button[text()='Hide']");
  if ((await btnHide.isExisting()) && (await btnHide.isDisplayed())) {
    await btnHide.click();
  }

  const btnView = await hotelsPage.btnViewByHotelName(hotelName);
  await btnView.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Element not displayed",
  });
  await HandleElement.scrollToElement(btnView);
  await btnView.click();

  var hotelNameInDetail = await hotelsPage.txtHotelNameinDetail.getText();
  await expect(hotelNameInDetail).toEqual(hotelName);
  await utils.takeScreenshot("Hotel name in detail is equal");
};
const verifyCityInSearchLocation = async (cityName) => {
  const cityNameOnCard = await hotelsPage.txtHotelLocation(cityName);
  for (const element of cityNameOnCard) {
    expect(await element.isDisplayed()).toBe(true);
  }
  await utils.takeScreenshot();
};

const selectDropdown = async (dropdown, option) => {
  const dropdownElement = await dropdown;
  await HandleElement.scrollToElement(dropdownElement);
  await dropdownElement.click();
  const optionElement = await option;
  await HandleElement.scrollToElement(optionElement);
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
  await utils.takeScreenshot();
};
const fillTravellersInformation = async () => {
  const elements = await hotelsPage.counterTraveller;

  elements.forEach(async (element, i) => {
    await selectDropdown(
      await hotelsPage.dropdownTravellerTitlebyOrder(i + 1),
      await hotelsPage.optionByTextOnDetail("Mr")
    );
    await (
      await hotelsPage.inputTravellerFirstNamebyOrder(i + 1)
    ).setValue("John");
    await (
      await hotelsPage.inputTravellerLastNamebyOrder(i + 1)
    ).setValue("Doe");
  });

  await report.addStep("input traveller is finished");
};
const fillHotelBookingInformation = async (isRegistered = true) => {
  if (!isRegistered) {
    await fillPersonalInformation();
    await utils.takeScreenshot();
  }
  await fillTravellersInformation();
  await report.addStep("now go to TnC");
  await utils.takeScreenshot();
  await hotelsPage.radioTnC.scrollIntoView();
  await report.addStep("now take TnC button");
  await utils.takeScreenshot();
  await hotelsPage.radioTnC.click();
  const btnBookingConfirm = await hotelsPage.btnByText("Booking Confirm");
  while (
    (await btnBookingConfirm.isDisplayed()) ||
    (await btnBookingConfirm.isClickable())
  ) {
    await btnBookingConfirm.click();
    await browser.pause(500); // Add a small wait to avoid excessive requests
  }

  await report.addStep("booking confirm");
  await browser.pause(15000);
};

const verifyTrxDetailAfterBooking = async () => {
  const paymentStatus = await hotelsPage.txtTrxDetailStatusByLabel(
    "Payment Status"
  );
  const bookingStatus = await hotelsPage.txtTrxDetailStatusByLabel(
    "Booking Status"
  );

  await paymentStatus.waitForDisplayed({ timeout: 10000 });
  await expect(paymentStatus).toHaveText("unpaid");

  await bookingStatus.waitForDisplayed({ timeout: 10000 });
  await expect(bookingStatus).toHaveText("pending");

  var bookingReference = await (await hotelsPage.txtBookingReference).getText();
  await GlobalVariables.setVariable("bookingReference", bookingReference);
  await console.log(
    "global variable test :" + GlobalVariables.getVariable("bookingReference")
  );
};

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
  await menuElement.doubleClick();
  await browser.pause(5000);

  await searchHotel(cityName);
  await verifyCityInSearchLocation(cityName);
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
  await fillHotelBookingInformation((isRegistered = true));
});

When(/^Non-Registered User continue finishing transaction$/, async () => {
  await fillHotelBookingInformation((isRegistered = false));
});

When(/^User have the transaction id$/, async () => {
  await verifyTrxDetailAfterBooking();
});

Given(
  /^User have searched for hotels in "(.*)" without login$/,
  async (cityName) => {
    // Write code here that turns the phrase above into concrete actions
    await page.open("");
    await utils.takeScreenshot();
    const menuSelector = `//a[contains(text(), 'Hotels')]`;
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

