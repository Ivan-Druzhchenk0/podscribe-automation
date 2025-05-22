import { BasePage } from './base.page';

import { Header } from 'src/components/header.component';

export class LoginPage extends BasePage {
  readonly header = new Header(this.page);

  async navigateToLoginPage(url: string = '/login') {
    await this.page.goto(url);
    await super.verifyPageOpened(/.*login/);
  }
}
