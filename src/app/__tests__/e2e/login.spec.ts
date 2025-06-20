import {test, expect} from "@playwright/test";
import {loginData} from "./test-data/login.data";
import {LoginPage} from "./pages/login.page";

test.describe("User login to generator-ogloeszen.com", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({page}) => {
    await page.goto("/");

    loginPage = new LoginPage(page);
    await loginPage.toLoginButton.click();
  });

  test(
    "successful login with correct credentials",
    {tag: "@login"},
    async ({page}) => {
      // Arrange
      const {userEmail, userPassword} = loginData;

      // Act
      await loginPage.login(userEmail, userPassword);

      // Assert
      await expect(page.getByText("Zalogowano pomyślnie")).toBeVisible();
    }
  );

  test(
    "unsuccessful login with invalid format email",
    {tag: "@login"},
    async () => {
      // Arrange
      const ivalidEmail = "invalidEmail";
      const expectedMessage = "Nieprawidłowy adres email";

      // Art
      await loginPage.emailInput.fill(ivalidEmail);
      await loginPage.passwordInput.click();

      // Assert
      await expect(loginPage.emailError).toHaveText(
        expectedMessage
      );
    }
  );

  test(
    "should show validation error when email is empty",
    {tag: "@login"},
    async () => {
      // Arrange
      const expectedMessage = "Email jest wymagany";
      // Art
      await loginPage.emailInput.fill("");
      await loginPage.emailInput.blur();

      // Assert
      await expect(loginPage.emailError).toHaveText(expectedMessage);
    }
  );
});
