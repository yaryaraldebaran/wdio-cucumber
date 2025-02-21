import { browser,$ } from '@wdio/globals'
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public async open(path: string): Promise<void> {
        await browser.url(`https://phptravels.net/${path}`);
        await browser.maximizeWindow()
    }

    async spanByTextEqualsDynamics(text: string) {
        return $(`//span[text()='${text}']`);
    }

    async spanByClassEqualsDynamics(text: string) {
        return $(`//span[@class='${text}']`);
    }
}
