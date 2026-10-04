import { render, screen } from "@testing-library/react";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import { DescriptionProvider } from "../../context/DescriptionContext";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks/useUser", () => ({
  useUser: () => ({ mutate: jest.fn() }),
}));

jest.mock("../../services/aiService", () => ({
  generateDescription: jest.fn(),
}));

describe("FormGenerator component", () => {
  it("should render textarea when component is mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(
      screen.getByLabelText(/pole do wpisania słów kluczowych ogłoszenia/i)
    ).toBeInTheDocument();
  });

  it("should render counter 0/500 when component is mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("should render generate button when mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(
      screen.getByRole("button", { name: /generuj ogłoszenie/i })
    ).toBeInTheDocument();
  });

  it("should show validation error when input is empty", async () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const button = screen.getByRole("button", { name: /generuj ogłoszenie/i });
    await userEvent.click(button);

    expect(
      await screen.findByText(/podaj słowa kluczowe albo dodaj zdjęcie/i)
    ).toBeInTheDocument();
  });

  it("should render portal chips including Allegro and Vinted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(screen.getByRole("radio", { name: "OLX" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Allegro" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Vinted" })).toBeInTheDocument();
  });
});
