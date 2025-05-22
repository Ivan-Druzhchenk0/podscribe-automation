import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async verifyPageOpened(url: string | RegExp) {
    await this.page.waitForURL(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectElementVisible(data: {
    pageLocator: string | Locator; // Accept both types
    visibility: boolean;
    text?: string;
    exact?: boolean;
  }) {
    let baseLocator;
    try {
      // Create a locator object based on the type of pageLocator
      baseLocator = typeof data.pageLocator === 'string' ? this.page.locator(data.pageLocator) : data.pageLocator;

      if (data.text) {
        await expect(baseLocator.getByText(data.text, { exact: data.exact })).toBeVisible({ visible: data.visibility });
      } else {
        await expect(baseLocator).toBeVisible({ visible: data.visibility });
      }
    } catch (error) {
      // Build a description for later logging
      const locatorDescription = typeof data.pageLocator === 'string' ? `'${data.pageLocator}'` : 'provided locator';

      let additionalInfo = '';
      if (baseLocator) {
        try {
          additionalInfo = await baseLocator.evaluate((el) => el.outerHTML);
        } catch (evalError) {
          additionalInfo = 'failed to extract outerHTML';
        }
      } else {
        additionalInfo = 'baseLocator is undefined';
      }

      // Log detailed information with the error.
      console.error(
        `Error: Element ${locatorDescription} ${data.text ? `with text '${data.text}' ` : ''}was expected to be ${
          data.visibility ? 'visible' : 'hidden'
        }, ` + `but it was not. Locator outerHTML: ${additionalInfo}. Original error: ${error}`
      );
    }
  }
}
