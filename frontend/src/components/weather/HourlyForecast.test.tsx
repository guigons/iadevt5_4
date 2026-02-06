import { render, screen } from "@testing-library/react";
import HourlyForecast from "./HourlyForecast";
import { TemperatureUnitProvider } from "./temperature-unit-context";
import type { HourlyForecast as HourlyForecastData } from "./weather.types";

function createHourlyData(count: number): HourlyForecastData[] {
  return Array.from({ length: count }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    temperature: 20 + i,
    weatherCode: 0,
  }));
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<TemperatureUnitProvider>{ui}</TemperatureUnitProvider>);
}

describe("HourlyForecast", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render all hourly items", () => {
    const data = createHourlyData(24);
    renderWithProvider(<HourlyForecast data={data} />);
    const items = screen.getAllByTestId("hourly-item");
    expect(items).toHaveLength(24);
  });

  it("should render time for each item", () => {
    const data = createHourlyData(3);
    renderWithProvider(<HourlyForecast data={data} />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("01:00")).toBeInTheDocument();
    expect(screen.getByText("02:00")).toBeInTheDocument();
  });

  it("should render temperature in celsius by default", () => {
    const data = createHourlyData(3);
    renderWithProvider(<HourlyForecast data={data} />);
    expect(screen.getByText("20°C")).toBeInTheDocument();
    expect(screen.getByText("21°C")).toBeInTheDocument();
    expect(screen.getByText("22°C")).toBeInTheDocument();
  });

  it("should render temperature in fahrenheit when stored", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    const data = createHourlyData(3);
    renderWithProvider(<HourlyForecast data={data} />);
    expect(screen.getByText("68°F")).toBeInTheDocument();
    expect(screen.getByText("70°F")).toBeInTheDocument();
    expect(screen.getByText("72°F")).toBeInTheDocument();
  });

  it("should have scroll container", () => {
    const data = createHourlyData(24);
    renderWithProvider(<HourlyForecast data={data} />);
    const scrollContainer = screen.getByTestId("hourly-scroll");
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass("overflow-x-auto");
  });
});
