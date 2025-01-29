const Page = require("./page");
const utils = require("../../utils/utils");
const report = require("@wdio/allure-reporter");
class HotelsPage extends Page{

    constructor() {
        super();  // Ensure base class constructor is called
    }
    
    /**
     * @returns {import('webdriverio').Element}
    */
    get searchSelector() {
        return $(`(//span[contains(@class,'select2')])[1]`)
    } 
    /**
     * @returns {import('webdriverio').Element}
    */
    get searchField()  {return  $(`//input[@type='search' and contains(@class,'select2')]`)}
    
    /**
     * @returns {import('webdriverio').Element}
    */
    get firstResult()  {return $(`//li[contains(@class,'select2-results')][1]`)}
    /**
     * @returns {import('webdriverio').Element}
    */
    async inputByLabel(text) {
        return $(`//input[ancestor::*[span/label/scrm-label[text()[normalize-space()='${text}']]]]`);
    }
        /**
     * @returns {import('webdriverio').Element}
    */

    get buttonSearch(){
        return $(`(//button[@type='submit' and contains(@class, 'search_button')])[2]`)
    }

    /**
     * @returns {import('webdriverio').Element}
    */
   async btnByText(text){
    return await $(`//button[contains(normalize-space(.), '${text}')]`)
   }

    /**
    * @returns {import('webdriverio').Element}
    */
    async btnViewByHotelName(text) {
        return await $(`//strong[text()='${text}']/ancestor::div[@class='card rounded-2']/descendant::a[normalize-space(text())='View More']`);
    }    
    /**
    * @returns {import('webdriverio').Element}
    */
    get txtHotelNameinDetail(){
        return $(`//strong/parent::div[@class='h4 fw-bold mb-0']`)
    }

    /**
    * @returns {import('webdriverio').Element}
    */
    async txtHotelLocation(text){
        return $$(`//p/small[contains(., '${text}')]`)
    }
    /**
    * @returns {import('webdriverio').Element}
    */
    get btnSelectRoom(){
        return $("//a[normalize-space(text())='Select Room']")
    }
        /**
    * @returns {import('webdriverio').Element}
    */
   get dropdownOnDetail(){
        return $("//select[@name='room_quantity']")
   }
   
   async optionByTextOnDetail(text){
    return $(`//option[starts-with(text(),'${text}')]`)
   }

    /**
    * @returns {import('webdriverio').Element}
    */
    async btnBookByRoomType(text){
        return $(`//div[./h5/strong[text()='${text}']]/descendant::button[./strong][1]`)
    }
    async inputPersonalInfoByLabelDynamic(text){
        return $(`//input[following-sibling::label[normalize-space(text())='${text}'] and ancestor::div/div/h3[normalize-space(text())='Personal Information']]`)
    }

    get counterTraveller(){
        return $$(`//div[./strong]`)
    }
    async inputTravellerFirstNamebyOrder(text){
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='First Name'][${text}]`)
    }
    async inputTravellerLastNamebyOrder(text){
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='Last Name'][${text}]`)
    }
    async dropdownTravellerTitlebyOrder(text){
        return $(`(//select[./following-sibling::label[text()='Title']])[${text}]`)
    }
    get checkboxTermsCondition(){
        return $(`//input[@id='agreechb']`)
    }
    get btnBookingConfirm(){
        return $(`//button[normalize-space(text())='Booking Confirm']`)
    }
    async txtHeaderStatusByField(text){
        return $(`//strong[text()='${text}']/following-sibling::span`)
    }
    /**
    * @returns {import('webdriverio').Element}
    */
    async txtTrxDetailStatusByLabel(text){
        return $(`//span[preceding-sibling::strong[text()='${text}']]`)
    }

    get txtBookingReference(){
        return $(`//table[thead//th[text()='Booking Reference']]/tbody/tr/th[2]`)
    }
    get radioTnC(){
        return $(`//input[@id='agreechb']`)
    }



    /*comment method 
    */
    async searchHotel(cityName) {
        console.log("Now searching hotel");

        await browser.pause(4000);
        await this.searchSelector.click();
        await this.searchField.setValue(cityName);
        await utils.takeScreenshot("Searching hotel with city filter");
        await browser.pause(2000);
        await this.firstResult.click();
        await report.addStep("Click first result city");
        await this.buttonSearch.waitForDisplayed({ timeout: 5000 });
        await this.buttonSearch.click();
        await browser.pause(10000);
        await utils.takeScreenshot("Hotel's search page displayed");
    }

    async selectHotel(hotelName) {
        const btnHide = await $("//button[text()='Hide']");
        if ((await btnHide.isExisting()) && (await btnHide.isDisplayed())) {
            await btnHide.click();
        }

        const btnView = await this.btnViewByHotelName(hotelName);
        await btnView.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: "Element not displayed",
        });
        await HandleElement.scrollToElement(btnView);
        await btnView.click();

        const hotelNameInDetail = await this.txtHotelNameinDetail.getText();
        await expect(hotelNameInDetail).toEqual(hotelName);
        await utils.takeScreenshot("Hotel name in detail is equal");
    }

    async verifyCityInSearchLocation(cityName) {
        const cityNameOnCard = await this.txtHotelLocation(cityName);
        for (const element of cityNameOnCard) {
            expect(await element.isDisplayed()).toBe(true);
        }
        await utils.takeScreenshot();
    }

    async selectDropdown(dropdown, option) {
        const dropdownElement = await dropdown;
        await HandleElement.scrollToElement(dropdownElement);
        await dropdownElement.click();
        const optionElement = await option;
        await HandleElement.scrollToElement(optionElement);
        await optionElement.click();
    }

    async fillPersonalInformation() {
        await (await this.inputPersonalInfoByLabelDynamic("First Name")).setValue("John");
        await (await this.inputPersonalInfoByLabelDynamic("Last Name")).setValue("Doe");
        await (await this.inputPersonalInfoByLabelDynamic("Email")).setValue("john@doe.com");
        await (await this.inputPersonalInfoByLabelDynamic("Address")).setValue("John Doe Address");
        await (await this.inputPersonalInfoByLabelDynamic("Phone")).setValue("088888888");
        await utils.takeScreenshot();
    }

    async fillTravellersInformation() {
        const elements = await this.counterTraveller;

        for (let i = 0; i < elements.length; i++) {
            await this.selectDropdown(
                await this.dropdownTravellerTitlebyOrder(i + 1),
                await this.optionByTextOnDetail("Mr")
            );
            await (await this.inputTravellerFirstNamebyOrder(i + 1)).setValue("John");
            await (await this.inputTravellerLastNamebyOrder(i + 1)).setValue("Doe");
        }

        await report.addStep("Input traveller is finished");
    }

    async fillHotelBookingInformation(isRegistered = true) {
        if (!isRegistered) {
            await this.fillPersonalInformation();
            await utils.takeScreenshot();
        }
        await this.fillTravellersInformation();
        await report.addStep("Now go to TnC");
        await utils.takeScreenshot();
        await this.radioTnC.scrollIntoView();
        await report.addStep("Now take TnC button");
        await utils.takeScreenshot();
        await this.radioTnC.click();
        const btnBookingConfirm = await this.btnByText("Booking Confirm");
        while (
            (await btnBookingConfirm.isDisplayed()) ||
            (await btnBookingConfirm.isClickable())
        ) {
            await btnBookingConfirm.click();
            await browser.pause(500);
        }

        await report.addStep("Booking confirmed");
        await browser.pause(15000);
    }

    async verifyTrxDetailAfterBooking() {
        const paymentStatus = await this.txtTrxDetailStatusByLabel("Payment Status");
        const bookingStatus = await this.txtTrxDetailStatusByLabel("Booking Status");

        await paymentStatus.waitForDisplayed({ timeout: 10000 });
        await expect(paymentStatus).toHaveText("unpaid");

        await bookingStatus.waitForDisplayed({ timeout: 10000 });
        await expect(bookingStatus).toHaveText("pending");

        const bookingReference = await this.txtBookingReference.getText();
        await GlobalVariables.setVariable("bookingReference", bookingReference);
        console.log("Global variable test: " + GlobalVariables.getVariable("bookingReference"));
    }
}

module.exports = new HotelsPage(); 