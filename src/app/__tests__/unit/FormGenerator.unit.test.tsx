import {render, screen} from "@testing-library/react";
import FormGenerator from "../../components/FormGenerator/FormGenerator";
import {DescriptionProvider} from "../../context/DescriptionContext";
import userEvent from "@testing-library/user-event";

describe("FormGenerator component", () => {
  it("should render textare when component is mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Opisz, co chcesz sprzedać lub zaoferować..."
    );

    expect(textarea).toBeInTheDocument();
  });

  it("should render counter 0/300 when component is mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(screen.getByText("0/300")).toBeInTheDocument();
  });

  it("should render button when is mounted", () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    expect(
      screen.getByRole("button", {name: /generuj opis ai/i})
    ).toBeInTheDocument();
  });

  it("should show validation error when input is empty", async () => {
    render(
      <DescriptionProvider>
        <FormGenerator />
      </DescriptionProvider>
    );

    const button = screen.getByRole("button", {name: /generuj opis ai/i});
    await userEvent.click(button);

    expect(await screen.findByText(/opis jest wymagany/i)).toBeInTheDocument();
  });
});
