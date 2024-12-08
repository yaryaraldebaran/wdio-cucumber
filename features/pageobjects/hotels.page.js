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
    get btnBookNow(){
        return $("//button[normalize-space()='Book Now']")
    }

}

module.exports = new HotelsPage(); 