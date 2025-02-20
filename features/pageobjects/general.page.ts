import Page from "./page";
import {$} from '@wdio/globals'
export default class GeneralPage extends Page{
    constructor() {
        super();  // Ensure base class constructor is called
    }
    async spanByTextEqualsDynamics(text: string) {
        return $(`//span[text()='${text}']`);
    }

    async spanByClassEqualsDynamics(text: string) {
        return $(`//span[@class='${text}']`);
    }
}