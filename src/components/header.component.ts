import { expect } from '@playwright/test';
import { Component } from './base.component';

export class Header extends Component {
  private root = this.page.locator('header');
  private searchBar = this.root.locator('input[id="react-select-2-input"]');
  private searchBarDropdown = this.root.locator('//div[contains(@class, "menu")]');

  async clickDiscoverShowsBtn() {
    await this.root.getByRole('link', { name: 'Discover Shows' }).click();
  }

  async searchWithSearchBar(searchString: string) {
    await this.searchBar.fill(searchString);
    await expect(this.searchBarDropdown).toBeVisible();
  }

  async clearSearchBar() {
    await this.searchBar.fill('');
    await expect(this.searchBarDropdown).toBeHidden();
  }

  async verifySearchResultInDropdown(searchString: string) {
    const searchBarDropdownItem = this.searchBarDropdown.locator('div[role="option"]');

    const items = await searchBarDropdownItem.all();
    for (const item of items) {
      const matchingResult = item.getByText(searchString);
      if (await matchingResult.isVisible()) {
        return true;
      } else {
        throw new Error(`Search result "${searchString}" not found in dropdown.`);
      }
    }
  }
}
