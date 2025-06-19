import {render, screen} from "@testing-library/react";
import LoginForm from "../../components/LoginForm/LoginForm";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("../../services/authService", () => ({
  loginUser: jest.fn(),
}));

describe("LoginForm component", () => {
  describe("rendering", () => {
    it("should render email and password fields and submit button when the form is loaded", () => {
      render(<LoginForm />);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/hasło/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", {name: /Zaloguj/i})
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it('should show "Email jest wymagany" when email input is blurred without value', async () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText(/email/i);

      await userEvent.click(emailInput);
      await userEvent.tab();

      expect(
        await screen.findByText("Email jest wymagany")
      ).toBeInTheDocument();
    });

    it('should show "Hasło jest wymagane" when password input is blurred without value', async () => {
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText(/hasło/i);

      await userEvent.click(passwordInput);
      await userEvent.tab();

      expect(
        await screen.findByText("Hasło jest wymagane")
      ).toBeInTheDocument();
    });
  });
});
