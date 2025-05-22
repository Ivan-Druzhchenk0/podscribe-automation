import { test as base } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DiscoverShowsPage } from '../pages/discover.page';

type Pages = {
  loginPage: LoginPage;
  discoverShowsPage: DiscoverShowsPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage('');
    await use(loginPage);
  },
  discoverShowsPage: async ({ page }, use) => {
    const discoverShowsPage = new DiscoverShowsPage(page);
    await use(discoverShowsPage);
  },
});
