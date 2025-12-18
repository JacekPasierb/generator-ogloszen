import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import LoginForm from "../../components/LoginForm/LoginForm";

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

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({
    user: null,
    loading: false,
    mutate: jest.fn().mockResolvedValue(undefined),
  }),
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

      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/email jest wymagany/i)).toBeInTheDocument();
      });
    });

    it('should show "Hasło jest wymagane" when password input is blurred without value', async () => {
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText(/hasło/i);

      fireEvent.blur(passwordInput);
      await waitFor(() => {
        expect(screen.getByText(/hasło jest wymagan/i)).toBeInTheDocument();
      });
    });
  });
});
