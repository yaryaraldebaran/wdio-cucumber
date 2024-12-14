const Page = require("./page");

class HotelsPage extends Page{

    constructor() {
        super();  // Ensure base class constructor is called
    }
    
    /**
     * @returns {import('webdriverio').Element}
    */
    get searchSelector() {
        return $(`//span[@aria-labelledby='select2-hotels_city-container']`)
    } 
    /**
     * @returns {import('webdriverio').Element}
    */
    get searchField()  {return  $(`//input[@type='search']`)}
    
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
    get buttonSearch(){
        return $(`//button[@type='submit']`)
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
    get btnBookNow(){
        return $("//button[normalize-space()='Book Now']")
    }
    async inputPersonalInfoByLabelDynamic(text){
        return $(`//input[following-sibling::label[normalize-space(text())='${text}'] and ancestor::div/div/h3[normalize-space(text())='Personal Information']]`)
    }

    get inputTravellerFirstName(){
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='First Name'][1]`)
    }
    get inputTravellerLastName(){
        return $(`//div[./div/h3[normalize-space(text())='Travellers Information']]/descendant::input[@placeholder='Last Name'][1]`)
    }
    get dropdownTravellerTitle(){
        return $(`(//select[./following-sibling::label[text()='Title']])[1]`)
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

}

module.exports = new HotelsPage(); 