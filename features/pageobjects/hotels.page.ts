import {$$,$,browser} from "@wdio/globals"
import Page from "./page";
import GlobalVariables from '../../utils/globalVariables';
import utils from "../../utils/utils";
import report from "@wdio/allure-reporter";
import type { ChainablePromiseElement } from 'webdriverio';
import HandleElement from "../../utils/handleElement";
import assert from "assert";


export default class HotelsPage extends Page{

    get searchSelector() {
        return $("(//span[contains(@class,'select2')])[1]");
    }

    get searchField()  {
        return $("//input[@type='search' and contains(@class,'select2')]");
    }

    get firstResult()  {
        return $("//li[contains(@class,'select2-results')][1]");
    }

    async inputByLabel(text: string)  {
        return $(`//input[ancestor::*[span/label/scrm-label[text()[normalize-space()='${text}']]]]`);
    }

    get buttonSearch(){
        return $("(//button[@type='submit' and contains(@class, 'search_button')])[2]");
    }

    async btnByText(text: string) {
        return $(`//button[contains(normalize-space(.), '${text}')]`);
    }

    async btnViewByHotelName(text: string) {
        return $(`//strong[text()='${text}']/ancestor::div[@class='mb-2']/descendant::a[normalize-space(text())='View More']`);
    }

    get txtHotelNameinDetail()  {
        return $(`//strong/parent::div[@class='h4 fw-bold mb-0']`);
    }

    async txtHotelLocation(text: string) {
        return $$(`//p/small[contains(., '${text}')]`);
    }

    get btnSelectRoom()  {
        return $("//a[normalize-space(text())='Select Room']");
    }

    get dropdownOnDetail()  {
        return $("//select[@name='room_quantity']");
    }

    async optionByTextOnDetail(text: string) {
        return $(`//option[starts-with(text(),'${text}')]`);
    }

    async btnBookByRoomType(text: string) {
        return $(`//div[./h5/strong[text()='${text}']]/descendant::button[./strong][1]`);
    }

    async inputPersonalInfoByLabelDynamic(text: string) {
        return $(`//input[following-sibling::label[normalize-space(text())='${text}'] and ancestor::div/div/h3[normalize-space(text())='Personal Information']]`);
    }

    async inputTravellerFirstNamebyOrder(index: number) {
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='First Name'][${index}]`);
    }

    async inputTravellerLastNamebyOrder(index: number) {
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='Last Name'][${index}]`);
    }

    async dropdownTravellerTitlebyOrder(index: number) {
        return $(`(//select[./following-sibling::label[text()='Title']])[${index}]`);
    }

    get checkboxTermsCondition() {
        return $("//input[@id='agreechb']");
    }

    get btnBookingConfirm() {
        return $("//button[normalize-space(text())='Booking Confirm']");
    }

    async txtHeaderStatusByField(text: string) {
        return $(`//strong[text()='${text}']/following-sibling::span`);
    }

    async txtTrxDetailStatusByLabel(text: string) {
        return $(`//span[preceding-sibling::strong[text()='${text}']]`);
    }

    get txtBookingReference() {
        return $("//table[thead//th[text()='Booking Reference']]/tbody/tr/th[2]");
    }

    get radioTnC() {
        return $("//input[@id='agreechb']");
    }
    get counterTraveller(){
        return $$(`//div[./strong]`)
    }


    /*comment method 
    */
    async searchHotel(cityName: string){
        console.log("Now searching hotel");

        await browser.pause(4000);
        await this.searchSelector.waitForDisplayed({ timeout: 20000 });
        await this.searchSelector.click();
        await this.searchField.setValue(cityName);
        await utils.takeScreenshot(null,"Searching hotel with city filter");
        await browser.pause(2000);
        await this.firstResult.click();
        await report.addStep("Click first result city");
        await this.buttonSearch.waitForDisplayed({ timeout: 5000 });
        await this.buttonSearch.click();
        await browser.pause(10000);
        await utils.takeScreenshot(null,"Hotel's search page displayed");
    }

    async selectHotel(hotelName: string){
        const btnHide = await $("//button[text()='Hide']");
        if (await btnHide.isExisting() && await btnHide.isDisplayed()) {
            await btnHide.click();
        }

        const btnView = await this.btnViewByHotelName(hotelName);
        await btnView.waitForDisplayed({ timeout: 5000, timeoutMsg: "Element not displayed" });
        await HandleElement.scrollToElement(btnView);
        await btnView.click();

        await this.txtHotelNameinDetail.waitForDisplayed({timeout:15000})
        const hotelNameInDetail = await this.txtHotelNameinDetail.getText();
        await expect(hotelNameInDetail).toEqual(hotelName);
        await utils.takeScreenshot(null,"Hotel name in detail is equal");
        const txtHotelLocationInDetail = (await this.spanByClassEqualsDynamics('text--overflow')).getText()
        const txtCityNameGlobal = GlobalVariables.getVariable("cityName")
        if (txtCityNameGlobal!==undefined){
            assert ((await txtHotelLocationInDetail).includes(String(txtCityNameGlobal)))
        }
        
    }

    async verifyCityInSearchLocation(cityName: string){
        // const cityNameOnCard = await this.txtHotelLocation(cityName);
        // for (const element of cityNameOnCard) {
        //     await expect(await element.isDisplayed()).toBe(true);
        // }
        // await utils.takeScreenshot();
        GlobalVariables.setVariable("cityName",cityName)
    }

    async selectDropdown(dropdown:ChainablePromiseElement, option:ChainablePromiseElement){
        const dropdownElement = await dropdown;
        await HandleElement.scrollToElement(dropdownElement);
        await dropdownElement.click();
        const optionElement = await option;
        await HandleElement.scrollToElement(optionElement);
        await optionElement.click();
    }

    async fillPersonalInformation(){
        await (await this.inputPersonalInfoByLabelDynamic("First Name")).setValue("John");
        await (await this.inputPersonalInfoByLabelDynamic("Last Name")).setValue("Doe");
        await (await this.inputPersonalInfoByLabelDynamic("Email")).setValue("john@doe.com");
        await (await this.inputPersonalInfoByLabelDynamic("Address")).setValue("John Doe Address");
        await (await this.inputPersonalInfoByLabelDynamic("Phone")).setValue("088888888");
        await utils.takeScreenshot();
    }

    async fillTravellersInformation(){
        const elements = await this.counterTraveller;

        for (let i = 0; i < await elements.length; i++) {
            await this.selectDropdown(
                await this.dropdownTravellerTitlebyOrder(i + 1),
                await this.optionByTextOnDetail("Mr")
            );
            await (await this.inputTravellerFirstNamebyOrder(i + 1)).setValue("John");
            await (await this.inputTravellerLastNamebyOrder(i + 1)).setValue("Doe");
        }

        await report.addStep("Input traveller is finished");
    }

    async fillHotelBookingInformation(isRegistered: boolean = true){
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
        while (await btnBookingConfirm.isDisplayed() || await btnBookingConfirm.isClickable()) {
            await btnBookingConfirm.click();
            await browser.pause(500);
        }

        await report.addStep("Booking confirmed");
        await browser.pause(15000);
    }

    async verifyTrxDetailAfterBooking(){
        const paymentStatus = await this.txtTrxDetailStatusByLabel("Payment Status");
        const bookingStatus = await this.txtTrxDetailStatusByLabel("Booking Status");

        await paymentStatus.waitForDisplayed({ timeout: 10000 });
        assert((await paymentStatus.getText()).includes("unpaid"));

        await utils.takeScreenshotWithHighlight(paymentStatus,"payment status")
        await utils.takeScreenshotWithHighlight(bookingStatus,"payment status")
        

        await bookingStatus.waitForDisplayed({ timeout: 10000 });
        assert((await bookingStatus.getText()).includes("pending"));

        const bookingReference = await this.txtBookingReference.getText();
        await GlobalVariables.setVariable("bookingReference", bookingReference);
        await report.addStep(`Global variable test: ${GlobalVariables.getVariable("bookingReference")}`)
        // console.log("Global variable test: " + );
    }
}

