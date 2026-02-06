import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemperatureUnitProvider, useTemperatureUnit } from "./temperature-unit-context";

function TestConsumer() {
  const { unit, toggleUnit } = useTemperatureUnit();
  return (
    <div>
      <span data-testid="unit">{unit}</span>
      <button onClick={toggleUnit} data-testid="toggle">Toggle</button>
    </div>
  );
}

describe("TemperatureUnitContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should default to celsius when no localStorage value", () => {
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    expect(screen.getByTestId("unit")).toHaveTextContent("celsius");
  });

  it("should read fahrenheit from localStorage", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    expect(screen.getByTestId("unit")).toHaveTextContent("fahrenheit");
  });

  it("should default to celsius for invalid localStorage value", () => {
    localStorage.setItem("temperatureUnit", "kelvin");
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    expect(screen.getByTestId("unit")).toHaveTextContent("celsius");
  });

  it("should toggle from celsius to fahrenheit", async () => {
    const user = userEvent.setup();
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    expect(screen.getByTestId("unit")).toHaveTextContent("celsius");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("unit")).toHaveTextContent("fahrenheit");
  });

  it("should toggle from fahrenheit to celsius", async () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    const user = userEvent.setup();
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    expect(screen.getByTestId("unit")).toHaveTextContent("fahrenheit");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("unit")).toHaveTextContent("celsius");
  });

  it("should persist toggle to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    await user.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("temperatureUnit")).toBe("fahrenheit");
  });

  it("should persist back to celsius in localStorage after double toggle", async () => {
    const user = userEvent.setup();
    render(
      <TemperatureUnitProvider>
        <TestConsumer />
      </TemperatureUnitProvider>
    );
    await user.click(screen.getByTestId("toggle"));
    await user.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("temperatureUnit")).toBe("celsius");
  });

  it("should throw error when useTemperatureUnit is used outside provider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useTemperatureUnit must be used within TemperatureUnitProvider"
    );
    consoleSpy.mockRestore();
  });
});
