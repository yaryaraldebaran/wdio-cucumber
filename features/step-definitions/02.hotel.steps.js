const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const hotelsPage = require('../pageobjects/hotels.page')

const LoginPage = require('../pageobjects/login.page');
const { default: getLogger } = require('@wdio/logger');




const pages = {
    login: LoginPage
}
// const hotelsPage = new HotelsPage()
const searchHotel = async (cityName)=>{
    console.log("Now search hotel")
    await browser.pause(4000)
    const searchSelect = hotelsPage.searchSelector
    await searchSelect.click()

    const searchField = hotelsPage.searchField
    await searchField.setValue(cityName)

    await browser.pause(2000)

    const firstResult = hotelsPage.firstResult
    await firstResult.click()
    await hotelsPage.buttonSearch.click()
    await browser.pause(10000)
}
const selectHotel = async(hotelName)=>{
    const btnView = await hotelsPage.btnViewByHotelName(hotelName);
    await btnView.scrollIntoView()
    await btnView.click();

    var hotelNameInDetail = await hotelsPage.txtHotelNameinDetail.getText()
    expect(hotelNameInDetail).toEqual(hotelName)
}
const verifyCityInSearchLocation = async (cityName)=>{
    const cityNameOnCard = await hotelsPage.txtHotelLocation(cityName)
    for (const element of cityNameOnCard) {
        expect(await element.isDisplayed()).toBe(true);
    }
}



Then(/^User search city "(.*)"$/, async (cityName) => {
    await searchHotel(cityName)
});
Then(/^User click hotel "(.*)" card$/, async (hotelName)=>{
    selectHotel(hotelName)
});

Then(/^User see "(.*)" city in result card$/, async (cityName)=>{
    verifyCityInSearchLocation(cityName)
});

Given(/^User have searched for hotels in "(.*)"$/, async (cityName)=>{
    await pages['login'].open()
    await LoginPage.login("user@phptravels.com", "demouser");
    searchHotel(cityName)
    verifyCityInSearchLocation(cityName)
    
});

When(/^User select card hotel "(.*)"$/,async (hotelName)=>{
    selectHotel(hotelName)
})

When(/^User create hotel booking$/,async ()=>{
    const btnSelectRoom = await hotelsPage.btnSelectRoom
    await btnSelectRoom.click()
    const btnBookNow = hotelsPage.btnBookNow
    //add select 
    await btnBookNow.scrollIntoView()
    await btnBookNow.click()
})

When(/^User continue finishing transaction$/,async ()=>{
    console.log("write code here for finishing transaction")
})

When(/^User have the transaction id$/,async ()=>{
    console.log("write code here for getting transaction")
})
