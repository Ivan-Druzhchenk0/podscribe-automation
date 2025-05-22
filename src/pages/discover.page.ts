import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

import { Header } from 'src/components/header.component';

export class DiscoverShowsPage extends BasePage {
  readonly header = new Header(this.page);

  private tableBody = this.page.locator('tbody');
  private tableRow = this.tableBody.getByTestId('TableRow');

  private async getRows(): Promise<Array<Locator>> {
    const rows = await this.tableRow.all();
    return rows;
  }

  private async getTitle(row: Locator): Promise<string | null> {
    const title = await row.locator('.MuiTypography-title-sm').textContent();
    return title;
  }

  async verifyPageOpened() {
    await super.verifyPageOpened(/.*series/);
  }

  async verifyHeader() {
    await this.expectElementVisible({
      pageLocator: this.page.getByRole('heading'),
      visibility: true,
      text: 'Discover Shows',
    });
  }

  async verifyTablePresented(tableElements: Array<string> = ['table', 'thead', 'tbody']) {
    for (const element of tableElements) {
      await this.expectElementVisible({
        pageLocator: element,
        visibility: true,
      });
    }
  }

  // This method can be enhanced to check also max number of rows on the page
  async verifyTableIsNotEmpty() {
    await this.tableRow.count().then((count) => {
      if (count === 0) {
        throw new Error('Table is empty! Please, check the data source or the table rendering logic.');
      }
      expect(count).toBeGreaterThan(0);
    });
  }

  async getShowsTitles(titles: Array<string>) {
    const rows = await this.getRows();

    for (const row of rows) {
      const title = await this.getTitle(row);

      if (!title) {
        throw new Error('Title can not be extracted!');
      }

      if (title) {
        titles.push(title);
      }
    }
  }

  async checkMaxPercentageChange(maxAllowedValue: number) {
    let changeNumber: string | null = null;
    const rows = await this.getRows();

    for (const row of rows) {
      const title = await this.getTitle(row);
      const percentageChangeText = await row.getByTestId('Chip').allTextContents();

      for (const text of percentageChangeText) {
        changeNumber = text?.replace(/%/g, '').trim();
      }

      if (!changeNumber) {
        throw new Error('Percentage change can not be extracted!');
      }

      if (+changeNumber > maxAllowedValue) {
        throw new Error(
          `Percentage change for row "${title}" is ${changeNumber}% and is higher than max allowed value of ${maxAllowedValue}%.`
        );
      }
    }
  }
}
