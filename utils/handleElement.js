class HandleElement {
    /**
     * Checks if the element exists and is displayed
     * @param {WebdriverIO.Element} element - The element to check
     * @returns {boolean} - True if the element exists and is displayed, false otherwise
     */
    static async isElementVisible(element) {
      try {
        await element.waitForDisplayed({ timeout: 5000 });
        return true;
      } catch (error) {
        console.warn("Element is not visible:", error.message);
        return false;
      }
    }
  
    /**
     * Clicks on an element after ensuring it is visible
     * @param {WebdriverIO.Element} element - The element to click
     */
    static async clickElement(element) {
      if (await this.isElementVisible(element)) {
        try {
          await element.click();
          console.log("Element clicked successfully.");
        } catch (error) {
          console.error("Failed to click the element:", error.message);
        }
      } else {
        console.error("Cannot click: Element is not visible.");
      }
    }
  
    /**
     * Scrolls to an element after ensuring it exists
     * @param {WebdriverIO.Element} element - The element to scroll to
     */
    /**
 * Scrolls to an element and adjusts its position to ensure it's clickable
 * @param {WebdriverIO.Element} element - The element to scroll to
 */
static async scrollToElement(element) {
    if (await this.isElementVisible(element)) {
      try {
        // Scroll the element into view
        await browser.execute((el) => {
          el.scrollIntoView({ block: 'center', inline: 'nearest' });
        }, element);
  
        // Additional adjustment to ensure the element is clickable
        const elementRect = await element.getRect();
        const viewportHeight = await browser.execute(() => window.innerHeight);
        const scrollOffset = elementRect.y + elementRect.height - viewportHeight;
  
        if (scrollOffset > 0) {
          await browser.execute((offset) => {
            window.scrollBy(0, offset);
          }, scrollOffset + 10); // Adjust with a small buffer
        }
  
        console.log("Scrolled to the element successfully.");
      } catch (error) {
        console.error("Failed to scroll to the element:", error.message);
      }
    } else {
      console.error("Cannot scroll: Element is not visible.");
    }
  }
  
  
    /**
     * Inputs text into an element after ensuring it is visible and interactable
     * @param {WebdriverIO.Element} element - The element to input text into
     * @param {string} text - The text to input
     */
    static async inputText(element, text) {
      if (await this.isElementVisible(element)) {
        try {
          await element.setValue(text);
          console.log(`Text "${text}" entered successfully.`);
        } catch (error) {
          console.error("Failed to input text:", error.message);
        }
      } else {
        console.error("Cannot input text: Element is not visible.");
      }
    }
  }
  
  module.exports = HandleElement;
  