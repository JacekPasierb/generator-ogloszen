import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as aiService from "../../services/aiService";
import { DescriptionProvider } from "../../context/DescriptionContext";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { toast } from "react-toastify";

const mutateMock = jest.fn();

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

jest.mock("../../services/aiService", () => ({
  generateDescription: jest.fn(),
}));

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({ mutate: mutateMock }),
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

    const textarea = screen.getByLabelText(
      /pole do wpisania słów kluczowych ogłoszenia/i
    );
    const button = screen.getByRole("button", { name: /generuj opis/i });

    await user.type(textarea, "Sprzedam rower");
    await user.click(button);

    await waitFor(() => {
      expect(aiService.generateDescription).toHaveBeenCalledWith({
        input: "Sprzedam rower",
        templateId: "default",
        outputFormat: "simple",
        imageDataUrl: undefined,
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

    const textarea = screen.getByLabelText(
      /pole do wpisania słów kluczowych ogłoszenia/i
    );
    const button = screen.getByRole("button", { name: /generuj opis/i });

    await user.type(textarea, "Sprzedam rower");
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Błąd generowania opisu:");
    });
  });
});
