import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as aiService from "../../services/aiService";
import {DescriptionProvider} from "../../context/DescriptionContext";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import {toast} from "react-toastify";

const mutateMock = jest.fn();

jest.mock("react-toastify", () => ({
  toast: {error: jest.fn()},
}));

jest.mock("../../services/aiService", () => ({
  generateDescription: jest.fn(),
}));

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({mutate: mutateMock}),
}));

describe("FormGenerator component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call generateDescription with input value", async () => {
    (aiService.generateDescription as jest.Mock).mockResolvedValueOnce({
      description: "Wygenerowany opis",
    });

    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(
      /opisz, co chcesz sprzedać lub zaoferować/i
    );
    const button = screen.getByRole("button", {name: /generuj opis ai/i});

    await user.type(textarea, "Sprzedam rower");
    await user.click(button);

    await waitFor(() => {
      expect(aiService.generateDescription).toHaveBeenCalledWith({
        input: "Sprzedam rower",
      });
    });
  });

  it("should show error toast when generateDescription throws error", async () => {
    (aiService.generateDescription as jest.Mock).mockRejectedValueOnce(
      new Error("Błąd generowania opisu:")
    );

    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(
      "Opisz, co chcesz sprzedać lub zaoferować..."
    );
    const button = screen.getByRole("button", {name: /generuj opis ai/i});

    await user.type(textarea, "Sprzedam rower");
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Błąd generowania opisu - spróbuj za chwilę!"
      );
    });
  });
});

// Aktualizacja testów - zweryfikować pod kątem starych zakomentowanych - stare zgodne ze starą specyfikacją
// BeforeEach - dobrze zorganizowane
// Nowe do przechodzenia, nie zweryfikowane

// import {render, screen, waitFor} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import * as aiService from "../../services/aiService";
// import {DescriptionProvider} from "../../context/DescriptionContext";
// import FormGenerator from "../../components/FormGenerator/FormGenerator";
// import {toast} from "react-toastify";

// const mutateMock = jest.fn();

// jest.mock("react-toastify", () => ({
//   toast: { error: jest.fn() },
// }));

// jest.mock("../../services/aiService", () => ({
//   generateDescription: jest.fn(),
// }));

// jest.mock("../../hooks/useUser", () => ({
//   useUser: () => ({ mutate: mutateMock }),
// }));

// describe("FormGenerator component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should call generateDescription with input value", async () => {
//     (aiService.generateDescription as jest.Mock).mockResolvedValueOnce({
//       description: "Wygenerowany opis",
//     });

//     render(
//       <DescriptionProvider>
//         <FormGenerator />
//       </DescriptionProvider>
//     );

//     const user = userEvent.setup();

//     const textarea = screen.getByPlaceholderText(
//       /opisz, co chcesz sprzedać lub zaoferować/i
//     );
//     const button = screen.getByRole("button", { name: /generuj opis ai/i });

//     await user.type(textarea, "Sprzedam rower");
//     await user.click(button);

//     await waitFor(() => {
//       expect(aiService.generateDescription).toHaveBeenCalledWith({
//         input: "Sprzedam rower",
//       });
//     });
//   });

//   it("should show error toast when generateDescription throws error", async () => {
//     (aiService.generateDescription as jest.Mock).mockRejectedValueOnce(
//       new Error("Błąd generowania opisu:")
//     );

//     render(
//       <DescriptionProvider>
//         <FormGenerator />
//       </DescriptionProvider>
//     );

//     const user = userEvent.setup();

//     const textarea = screen.getByPlaceholderText(
//       "Opisz, co chcesz sprzedać lub zaoferować..."
//     );
//     const button = screen.getByRole("button", { name: /generuj opis ai/i });

//     await user.type(textarea, "Sprzedam rower");
//     await user.click(button);

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith(
//         "Błąd generowania opisu - spróbuj za chwilę!"
//       );
//     });
//   });
// });
