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

  test.only(
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
});
