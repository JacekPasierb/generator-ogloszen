/**
 * Testy integracyjne dla funkcji trial credits
 * Testują pełny przepływ: rejestracja → generowanie → zużycie kredytów
 */

import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as aiService from "../../services/aiService";
import {DescriptionProvider} from "../../context/DescriptionContext";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import {toast} from "react-toastify";

const mutateMock = jest.fn();

jest.mock("react-toastify", () => ({
  toast: {error: jest.fn(), success: jest.fn()},
}));

jest.mock("../../services/aiService", () => ({
  generateDescription: jest.fn(),
}));

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({
    mutate: mutateMock,
    trialCredits: 2,
    totalCredits: 2,
    aiLeft: 0,
    isPaid: false,
  }),
}));

describe("Trial Credits Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow generation with trial credits", async () => {
    (aiService.generateDescription as jest.Mock).mockResolvedValueOnce({
      description: "Wygenerowany opis",
      credits: {trialCredits: 1, paidCredits: 0, total: 1},
    });

    const onNoCredits = jest.fn();

    render(
      <DescriptionProvider>
        <FormGenerator onNoCredits={onNoCredits} />
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
      expect(aiService.generateDescription).toHaveBeenCalled();
    });

    expect(onNoCredits).not.toHaveBeenCalled();
  });

  it("should show paywall when no credits available", async () => {
    (aiService.generateDescription as jest.Mock).mockRejectedValueOnce(
      new Error("Brak dostępnych kredytów. Wybierz pakiet, aby kontynuować.")
    );

    const onNoCredits = jest.fn();

    render(
      <DescriptionProvider>
        <FormGenerator onNoCredits={onNoCredits} />
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
      expect(onNoCredits).toHaveBeenCalled();
    });
  });
});
