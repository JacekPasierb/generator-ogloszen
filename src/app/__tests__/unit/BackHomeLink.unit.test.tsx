import React from "react";

import {render, screen} from "@testing-library/react";
import BackHomeLink from "../../components/BackHomeLink/BackHomeLink";

import '@testing-library/jest-dom'

describe("BackHomeLink", () => {
  it("renderuje link do strony głównej z poprawnym tekstem i atrybutami", () => {
    render(<BackHomeLink />);

    const link = screen.getByRole("link", {
      name: "Powrót na stronę główną",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("title", "Powrót na stronę główną");
    expect(link).toHaveTextContent("← Wróć na stronę główną");
  });
});
