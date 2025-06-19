import {render, screen} from "@testing-library/react";
import BtnAuth from "../../components/BtnAuth/BtnAuth";
import "@testing-library/jest-dom";

describe("BtnAuth", () => {
  it("should render children when isSubmitting is false", () => {
    render(<BtnAuth>Logowanie</BtnAuth>);
    expect(screen.getByRole("button")).toHaveTextContent("Logowanie");
  });

  it("should not be disabled when isSubmitting is false", () => {
    render(<BtnAuth>Logowanie</BtnAuth>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it('should have aria-busy="false" when isSubmitting is false', () => {
    render(<BtnAuth>Logowanie</BtnAuth>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "false");
  });

  it("should show spinner when isSubmitting is true", () => {
    render(<BtnAuth isSubmitting />);
    expect(screen.getByRole("button").querySelector("div")).toBeInTheDocument();
  });
});
