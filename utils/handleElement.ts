import type { ChainablePromiseElement, Element } from 'webdriverio';
import {browser} from '@wdio/globals'

class HandleElement {
    /**
     * Checks if the element exists and is displayed
     * @param element - The element to check
     * @returns True if the element exists and is displayed, false otherwise
     */
    static async isElementVisible(element: ChainablePromiseElement): Promise<boolean> {
        try {
            await element.waitForDisplayed({ timeout: 5000 });
            return true;
        } catch (error) {
            console.warn("Element is not visible:", (error as Error).message);
            return false;
        }
    }

    /**
     * Clicks on an element after ensuring it is visible
     * @param element - The element to click
     */
    static async clickElement(element: ChainablePromiseElement): Promise<void> {
        if (await this.isElementVisible(element)) {
            try {
                await element.click();
                console.log("Element clicked successfully.");
            } catch (error) {
                console.error("Failed to click the element:", (error as Error).message);
            }
        } else {
            console.error("Cannot click: Element is not visible.");
        }
    }

    /**
     * Scrolls to an element and adjusts its position to ensure it's clickable
     * @param element - The element to scroll to
     */
    static async scrollToElement(element: ChainablePromiseElement): Promise<void> {
        if (await this.isElementVisible(element)) {
            try {
                await browser.execute((el: HTMLElement) => {
                    el.scrollIntoView({ block: "center", inline: "nearest" });
                }, element as unknown as HTMLElement);
    
                const resolvedElement = element as unknown as WebdriverIO.Element; // Ensure it's a WebdriverIO.Element
                const elementId = resolvedElement.elementId
                const elementRect = await element.getElementRect(elementId);
                const viewportHeight = await browser.execute(() => window.innerHeight) as number;
                const scrollOffset = elementRect.y + elementRect.height - viewportHeight;
    
                if (scrollOffset > 0) {
                    await browser.execute((offset: number) => {
                        window.scrollBy(0, offset);
                    }, scrollOffset + 10);
                }
    
                console.log("Scrolled to the element successfully.");
            } catch (error) {
                console.error("Failed to scroll to the element:", (error as Error).message);
            }
        } else {
            console.error("Cannot scroll: Element is not visible.");
        }
    }
    

    /**
     * Inputs text into an element after ensuring it is visible and interactable
     * @param element - The element to input text into
     * @param text - The text to input
     */
    static async inputText(element: ChainablePromiseElement, text: string): Promise<void> {
        if (await this.isElementVisible(element)) {
            try {
                await element.setValue(text);
                console.log(`Text "${text}" entered successfully.`);
            } catch (error) {
                console.error("Failed to input text:", (error as Error).message);
            }
        } else {
            console.error("Cannot input text: Element is not visible.");
        }
    }
}

export default HandleElement;
