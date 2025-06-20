import {Locator, Page} from "@playwright/test";

export class LoginPage {
  toLoginButton: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;

  constructor(private page: Page) {
    this.toLoginButton = this.page.getByRole("link", {name: "Zaloguj się"});
    this.emailInput = this.page.getByRole("textbox", {name: "Email"});
    this.passwordInput = this.page.getByRole("textbox", {name: "Hasło"});
    this.loginButton = this.page.getByRole("button", {name: "Zaloguj"});
  }

  async login(userEmail: string, userPassword: string): Promise<void> {
    await this.emailInput.fill(userEmail);
    await this.passwordInput.fill(userPassword);
    await this.loginButton.click();
  }
}
