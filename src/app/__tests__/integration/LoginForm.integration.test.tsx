import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../components/LoginForm/LoginForm";
import {loginUser} from "../../services/authService";
import {toast} from "react-toastify";

const replaceMock = jest.fn();
const mutateMock = jest.fn().mockResolvedValue(undefined);

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("../../services/authService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({ mutate: mutateMock }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));




describe("LoginForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call loginUser with correct data when form is submitted", async () => {
    (loginUser as jest.Mock).mockResolvedValue({});

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), "t@e.co");
    await user.type(screen.getByPlaceholderText(/hasło/i), "T12345");
    await user.click(screen.getByRole("button", {name: /zaloguj/i}));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({email: "t@e.co", password: "T12345"});
    });
  });

  it("should call mutate and redirect after successful login", async () => {
    (loginUser as jest.Mock).mockResolvedValue({});

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), "t@e.co");
    await user.type(screen.getByPlaceholderText(/hasło/i), "T12345");
    await user.click(screen.getByRole("button", {name: /zaloguj/i}));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1);
      expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should show error toast when loginUser throws an error with message", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce(new Error("Nieprawidłowe dane logowania"));

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), "t@e.co");
    await user.type(screen.getByPlaceholderText(/hasło/i), "WrongPass123");
    await user.click(screen.getByRole("button", {name: /zaloguj/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nieprawidłowe dane logowania");
    });
  });

  it("should show generic error toast when loginUser throws unknown error", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce("some unexpected error");

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), "t@e.co");
    await user.type(screen.getByPlaceholderText(/hasło/i), "WrongPass123");
    await user.click(screen.getByRole("button", {name: /zaloguj/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Wystąpił błąd serwera");
    });
  });
});










// Aktualizacja testów - zweryfikować pod kątem starych zakomentowanych - stare zgodne ze starą specyfikacją
// BeforeEach - dobrze zorganizowane
// Nowe do przechodzenia, nie zweryfikowane

// import {render, screen, waitFor} from "@testing-library/react";
// import {loginUser} from "../../services/authService";
// import LoginForm from "../../components/LoginForm/LoginForm";
// import userEvent from "@testing-library/user-event";
// import {toast} from "react-toastify";

// // const pushMock = jest.fn();

// const replaceMock = jest.fn();

// jest.mock("next/navigation", () => ({
//   useRouter: () => ({
//     replace: replaceMock,
//     push: jest.fn(),
//     refresh: jest.fn(),
//     prefetch: jest.fn(),
//   }),
// }));

// jest.mock("../../services/authService", () => ({
//   loginUser: jest.fn(),
// }));

// jest.mock("react-toastify", () => ({
//   toast: {
//     success: jest.fn(),
//     error: jest.fn(),
//   },
// }));
// describe("LoginForm component", () => {
//   describe("successful submission", () => {

//     beforeEach(async () => {
    
//       (loginUser as jest.Mock).mockResolvedValue({}); // nie "Once"
//       render(<LoginForm />);
    
//       const email = screen.getByPlaceholderText(/email/i);
//       const pass = screen.getByPlaceholderText(/hasło/i);
    
//       await userEvent.type(email, "t@e.co");
//       await userEvent.type(pass, "T12345");
    
//       // 🔥 ważne: sprawdzamy czy faktycznie wpisało
//       expect(email).toHaveValue("t@e.co");
//       expect(pass).toHaveValue("T12345");
    
//       await userEvent.click(screen.getByRole("button", { name: /zaloguj/i }));
//     });

//     it.only("should call loginUser with correct data when form is submitted", async () => {
//       await waitFor(() => {
//         expect(loginUser).toHaveBeenCalledWith({ email: "t@e.co", password: "T12345" });
//       });
  
//     });

  

//     it("should call resetForm after successful login", async () => {
//       await waitFor(() => {
//         expect(screen.getByPlaceholderText(/email/i)).toHaveValue("");
//         expect(screen.getByPlaceholderText(/hasło/i)).toHaveValue("");
//       });
//     });

//     it("should call router.push('/dashboard') after successful login", async () => {
//       await waitFor(() => {
//         expect(replaceMock).toHaveBeenCalledWith("/dashboard");
//       });
//     });
//   });

//   describe("failed submission", () => {
//     it("should show error toast when loginUser throws an error with message", async () => {
//       (loginUser as jest.Mock).mockRejectedValueOnce(
//         new Error("Nieprawidłowe dane logowania")
//       );

//       render(<LoginForm />);

//       await userEvent.type(screen.getByPlaceholderText(/email/i), "t@e.co");
//       await userEvent.type(
//         screen.getByPlaceholderText(/hasło/i),
//         "WrongPass123"
//       );
//       await userEvent.click(screen.getByRole("button", {name: /zaloguj/i}));

//       await waitFor(() => {
//         expect(toast.error).toHaveBeenCalledWith(
//           "Nieprawidłowe dane logowania"
//         );
//       });
//     });

//     it("should show generic error toast when loginUser throws unknown error", async () => {
//       (loginUser as jest.Mock).mockRejectedValueOnce("some unexpected error");

//       render(<LoginForm />);

//       await userEvent.type(screen.getByPlaceholderText(/email/i), "t@e.co");
//       await userEvent.type(
//         screen.getByPlaceholderText(/hasło/i),
//         "WrongPass123"
//       );
//       await userEvent.click(screen.getByRole("button", {name: /zaloguj/i}));

//       await waitFor(() => {
//         expect(toast.error).toHaveBeenCalledWith("Wystąpił błąd serwera");
//       });
//     });
//   });
// });
