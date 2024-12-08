const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const hotelsPage = require('../pageobjects/hotels.page')

const LoginPage = require('../pageobjects/login.page');




const pages = {
    login: LoginPage
}
// const hotelsPage = new HotelsPage()
const searchHotel = async (cityName)=>{
    console.log("Now search hotel")
    
    await browser.pause(4000)
    // const searchSelect = hotelsPage.searchSelector
    await hotelsPage.searchSelector.click()

    // const searchField = hotelsPage.searchField
    await hotelsPage.searchField.setValue(cityName)

    await browser.pause(2000)

    // const firstResult = hotelsPage.firstResult
    await hotelsPage.firstResult.click()
    await hotelsPage.buttonSearch.click()
    await browser.pause(10000)
}
const selectHotel = async(hotelName)=>{
    // const txtGetApp = await $("//strong[normalize-space()='Get The App!']")
    // await txtGetApp.scrollIntoView()
    const btnHide = await $("//button[text()='Hide']")
    await btnHide.click()
    const btnView = await hotelsPage.btnViewByHotelName(hotelName);
    await btnView.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Element not displayed' })
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
    await selectHotel(hotelName)
});

Then(/^User see "(.*)" city in result card$/, async (cityName)=>{
    await verifyCityInSearchLocation(cityName)
});

Given(/^User have searched for hotels in "(.*)"$/, async (cityName)=>{
    await pages['login'].open()
    await LoginPage.login("user@phptravels.com", "demouser");
    const menuSelector = `//a[contains(text(), 'Hotels')]`; 
    const menuElement = await $(menuSelector);
    await menuElement.click();
    await browser.pause(5000)

    await searchHotel(cityName)
    await verifyCityInSearchLocation(cityName)
    
});

When(/^User select card hotel "(.*)"$/,async (hotelName)=>{
    await selectHotel(hotelName)
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
    await console.log("write code here for finishing transaction")
})

When(/^User have the transaction id$/,async ()=>{
    await console.log("write code here for getting transaction")
})
