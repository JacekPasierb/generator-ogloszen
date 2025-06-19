import {render, screen, waitFor} from "@testing-library/react";
import * as aiService from "../../services/aiService";
import {DescriptionProvider} from "../../context/DescriptionContext";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import userEvent from "@testing-library/user-event";
import {toast} from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../services/aiService");

describe("FormGenerator component", () => {
  it("should call generateDescription with input value", async () => {
    const mockGenerateDescription = jest.fn().mockResolvedValue({
      description: "Wygenerowany opis",
    });

    (aiService.generateDescription as jest.Mock) = mockGenerateDescription;

    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const textarea = screen.getByPlaceholderText(
      /opisz, co chcesz sprzedać lub zaoferować/i
    );
    const button = screen.getByRole("button", {
      name: /generuj opis ai/i,
    });

    await userEvent.type(textarea, "Sprzedam rower");
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockGenerateDescription).toHaveBeenCalledWith({
        input: "Sprzedam rower",
      });
    });
  });

  it("should show error toast when generateDescription throws error", async () => {
    (aiService.generateDescription as jest.Mock).mockRejectedValue(
      new Error("Błąd generowania opisu:")
    );

    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Opisz, co chcesz sprzedać lub zaoferować..."
    );
    const button = screen.getByRole("button", {name: /generuj opis ai/i});

    await userEvent.type(textarea, "Sprzedam rower");
    await userEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Błąd generowania opisu - spróbuj za chwilę!"
      );
    });
  });
});
