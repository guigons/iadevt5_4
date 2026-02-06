import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TemperatureToggle from "./TemperatureToggle";
import { TemperatureUnitProvider } from "./temperature-unit-context";

function renderWithProvider() {
  return render(
    <TemperatureUnitProvider>
      <TemperatureToggle />
    </TemperatureUnitProvider>
  );
}

describe("TemperatureToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render celsius and fahrenheit buttons", () => {
    renderWithProvider();
    expect(screen.getByTestId("toggle-celsius")).toHaveTextContent("°C");
    expect(screen.getByTestId("toggle-fahrenheit")).toHaveTextContent("°F");
  });

  it("should highlight celsius button by default", () => {
    renderWithProvider();
    expect(screen.getByTestId("toggle-celsius")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("toggle-fahrenheit")).toHaveAttribute("aria-pressed", "false");
  });

  it("should toggle to fahrenheit on click", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId("toggle-fahrenheit"));
    expect(screen.getByTestId("toggle-fahrenheit")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("toggle-celsius")).toHaveAttribute("aria-pressed", "false");
  });

  it("should toggle back to celsius on click", async () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    const user = userEvent.setup();
    renderWithProvider();
    expect(screen.getByTestId("toggle-fahrenheit")).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByTestId("toggle-celsius"));
    expect(screen.getByTestId("toggle-celsius")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("toggle-fahrenheit")).toHaveAttribute("aria-pressed", "false");
  });

  it("should persist selection in localStorage", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId("toggle-fahrenheit"));
    expect(localStorage.getItem("temperatureUnit")).toBe("fahrenheit");
  });
});
