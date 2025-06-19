import {render, screen, waitFor} from "@testing-library/react";
import {loginUser} from "../../services/authService";
import LoginForm from "../../components/LoginForm/LoginForm";
import userEvent from "@testing-library/user-event";
import {toast} from "react-toastify";

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

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
describe("LoginForm component", () => {
  describe("successful submission", () => {
    beforeEach(async () => {
      (loginUser as jest.Mock).mockResolvedValueOnce({});
      render(<LoginForm />);
      await userEvent.type(screen.getByPlaceholderText(/email/i), "t@e.co");
      await userEvent.type(screen.getByPlaceholderText(/hasło/i), "T12345");
      await userEvent.click(screen.getByRole("button", {name: /zaloguj/i}));
    });

    it("should call loginUser with correct data when form is submitted", async () => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "t@e.co",
        password: "T12345",
      });
    });

    it("should show success toast on successful login", async () => {
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Zalogowano pomyślnie");
      });
    });

    it("should call resetForm after successful login", async () => {
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/email/i)).toHaveValue("");
        expect(screen.getByPlaceholderText(/hasło/i)).toHaveValue("");
      });
    });

    it("should call router.push('/dashboard') after successful login", async () => {
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("failed submission", () => {
    it("should show error toast when loginUser throws an error with message", async () => {
      (loginUser as jest.Mock).mockRejectedValueOnce(
        new Error("Nieprawidłowe dane logowania")
      );

      render(<LoginForm />);

      await userEvent.type(screen.getByPlaceholderText(/email/i), "t@e.co");
      await userEvent.type(
        screen.getByPlaceholderText(/hasło/i),
        "WrongPass123"
      );
      await userEvent.click(screen.getByRole("button", {name: /zaloguj/i}));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Nieprawidłowe dane logowania"
        );
      });
    });

    it("should show generic error toast when loginUser throws unknown error", async () => {
      (loginUser as jest.Mock).mockRejectedValueOnce("some unexpected error");

      render(<LoginForm />);

      await userEvent.type(screen.getByPlaceholderText(/email/i), "t@e.co");
      await userEvent.type(
        screen.getByPlaceholderText(/hasło/i),
        "WrongPass123"
      );
      await userEvent.click(screen.getByRole("button", {name: /zaloguj/i}));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Wystąpił błąd serwera");
      });
    });
  });
});
