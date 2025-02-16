import { $ } from "@wdio/globals";
import Page from "../features/pageobjects/page";
import report, { addAttachment } from "@wdio/allure-reporter";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {browser} from "@wdio/globals"

class Utils {
  getScreenshotName(name: string | null = null): string {
    if (!name || name.trim() === "") {
      const now = new Date();
      const formattedDate = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
      return `screenshot_${formattedDate}.png`;
    }
    return `${name}.png`;
  }

  async takeScreenshot(element: WebdriverIO.Element | null = null, param: string | null = null): Promise<void> {
    const screenshotName = this.getScreenshotName(param);
    const screenshotPath = path.join(process.cwd(), "screenshots", screenshotName);
    
    if (!fs.existsSync(path.dirname(screenshotPath))) {
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    }
    
    await browser.saveScreenshot(screenshotPath);
    const screenshotData = fs.readFileSync(screenshotPath);
    
    report.startStep(`Step: ${screenshotName}`);
    report.addAttachment("Screenshot", screenshotData, "image/png");
    report.endStep();
  }

  get flashAlert() {
    return $("#flash");
  }

  async takeScreenshotWithHighlight(element: WebdriverIO.Element, param: string = "screenshot"): Promise<void> {
    if (!element) {
      throw new Error("Element is required for highlighting in screenshot");
    }

    await element.waitForExist({ timeout: 5000 });
    await element.waitForDisplayed({ timeout: 5000 });
    
    const { x, y } = await element.getLocation();
    const { width, height } = await element.getSize();
    
    const screenshotName = `${param}.png`;
    const screenshotsDir = path.join(process.cwd(), "screenshots");
    const screenshotPath = path.join(screenshotsDir, screenshotName);
    const highlightedPath = path.join(screenshotsDir, `highlighted_${screenshotName}`);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    await browser.saveScreenshot(screenshotPath);

    const image = sharp(screenshotPath);
    const metadata = await image.metadata();

    const overlay = Buffer.from(`
      <svg width="${metadata.width}" height="${metadata.height}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" 
              fill="none" stroke="red" stroke-width="4"/>
      </svg>
    `);

    await image.composite([{ input: overlay, top: 0, left: 0 }]).toFile(highlightedPath);
    const finalScreenshotBase64 = fs.readFileSync(highlightedPath).toString("base64");
    
    report.addAttachment("Highlighted Screenshot", Buffer.from(finalScreenshotBase64, "base64"), "image/png");
  }

  async waitForPageLoaded(timeout: number = 120000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => document.readyState);
        return readyState === "complete";
      },
      {
        timeout,
        timeoutMsg: "Page did not load completely within the specified timeout",
      }
    );
  }
}

export default new Utils();
