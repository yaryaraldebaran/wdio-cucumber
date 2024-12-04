const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const hotelsPage = require('../pageobjects/hotels.page')
// const hotelsPage = new HotelsPage()



Then(/^I search city "(.*)"$/, async (cityName) => {
    await hotelsPage.searchSelector.click()
    await hotelsPage.searchField.setValue(cityName)
    await browser.pause(2000)
    await hotelsPage.firstResult.click()
    await hotelsPage.buttonSearch.click()
    await browser.pause(10000)
});
Then(/^I click option "(.*)"$/, async (hotelName)=>{
    const btnView = await hotelsPage.btnViewByHotelName(hotelName);
    await btnView.click();

    var hotelNameInDetail = await hotelsPage.txtHotelNameinDetail.getText()
    expect(hotelNameInDetail).toEqual(hotelName)
});