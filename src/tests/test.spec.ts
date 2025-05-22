import { test } from 'src/fixtures';

const titles: string[] = [];

test.beforeEach(async ({ loginPage, discoverShowsPage }) => {
  await loginPage.header.clickDiscoverShowsBtn();
  await discoverShowsPage.verifyPageOpened();
  await discoverShowsPage.verifyHeader();
  await discoverShowsPage.verifyTablePresented();
  await discoverShowsPage.verifyTableIsNotEmpty();
});

test('Verify shows appear in search results', async ({ loginPage, discoverShowsPage }) => {
  await discoverShowsPage.getShowsTitles(titles);
  for (const title of titles) {
    await discoverShowsPage.header.searchWithSearchBar(title);
    await discoverShowsPage.header.verifySearchResultInDropdown(title);
    await discoverShowsPage.header.clearSearchBar();
  }
});

test('Verify change percentage value', async ({ discoverShowsPage }) => {
  await discoverShowsPage.checkMaxPercentageChange(80);
});
