const { Given, When, Then } = require('@wdio/cucumber-framework');
const { expect, $, browser } = require('@wdio/globals')

const hotelsPage = require('../pageobjects/hotels.page')

const LoginPage = require('../pageobjects/login.page');

const utils = require('../../utils/utils')


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
    await utils.customTakeScreenshot()
    await browser.pause(2000)

    // const firstResult = hotelsPage.firstResult
    await hotelsPage.firstResult.click()
    await hotelsPage.buttonSearch.click()
    await browser.pause(10000)
    await utils.customTakeScreenshot()
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
    await expect(hotelNameInDetail).toEqual(hotelName)
    await utils.customTakeScreenshot()
}
const verifyCityInSearchLocation = async (cityName)=>{
    const cityNameOnCard = await hotelsPage.txtHotelLocation(cityName)
    for (const element of cityNameOnCard) {
        expect(await element.isDisplayed()).toBe(true);
    }
    await utils.customTakeScreenshot()
}

const selectDropdown = async (dropdown, option)=>{
    const dropdownElement = await dropdown
    await dropdownElement.click()
    const optionElement = await option 
    await optionElement.click()
    
}
const fillPersonalInformation = async()=>{
    await (await hotelsPage.inputPersonalInfoByLabelDynamic('First Name')).setValue('John');
    await (await hotelsPage.inputPersonalInfoByLabelDynamic('Last Name')).setValue('Doe');
    await (await hotelsPage.inputPersonalInfoByLabelDynamic('Email')).setValue('john@doe.com');
    await (await hotelsPage.inputPersonalInfoByLabelDynamic('Address')).setValue('John Doe Address');
    await (await hotelsPage.inputPersonalInfoByLabelDynamic('Phone')).setValue('088888888');
}
const fillTravellersInformation = async()=>{
    selectDropdown(
        await hotelsPage.dropdownTravellerTitle,
        await hotelsPage.optionByTextOnDetail("Mr")
    )
    await utils.customTakeScreenshot()
    await (await hotelsPage.inputTravellerFirstName.setValue("John"))
    await (await hotelsPage.inputTravellerLastName.setValue("Doe"))
    await utils.customTakeScreenshot()
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
    await selectDropdown(
        await hotelsPage.dropdownOnDetail,
        await hotelsPage.optionByTextOnDetail("1 -")
    )
    const btnBookNow = hotelsPage.btnBookNow
    //add select 
    await btnBookNow.scrollIntoView()
    await btnBookNow.click()
})

When(/^User continue finishing transaction$/,async ()=>{
    await fillTravellersInformation()
})

When(/^User have the transaction id$/,async ()=>{
    await console.log("write code here for getting transaction")
})
