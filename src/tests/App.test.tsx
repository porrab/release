import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App component", () => {
  it("renders vite", () => {
    render(<App></App>);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });
});

