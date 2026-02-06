import { render, screen } from "@testing-library/react";
import DailyForecast from "./DailyForecast";
import { TemperatureUnitProvider } from "./temperature-unit-context";
import type { DailyForecast as DailyForecastData } from "./weather.types";

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const mockDailyData: DailyForecastData[] = [
  { date: getTodayString(), dayOfWeek: "Segunda", temperatureMin: 18, temperatureMax: 28, weatherCode: 2 },
  { date: "2099-01-02", dayOfWeek: "Terça", temperatureMin: 17, temperatureMax: 27, weatherCode: 3 },
  { date: "2099-01-03", dayOfWeek: "Quarta", temperatureMin: 19, temperatureMax: 29, weatherCode: 0 },
  { date: "2099-01-04", dayOfWeek: "Quinta", temperatureMin: 20, temperatureMax: 30, weatherCode: 1 },
  { date: "2099-01-05", dayOfWeek: "Sexta", temperatureMin: 16, temperatureMax: 25, weatherCode: 61 },
  { date: "2099-01-06", dayOfWeek: "Sábado", temperatureMin: 15, temperatureMax: 24, weatherCode: 63 },
  { date: "2099-01-07", dayOfWeek: "Domingo", temperatureMin: 14, temperatureMax: 23, weatherCode: 2 },
];

function renderWithProvider(ui: React.ReactElement) {
  return render(<TemperatureUnitProvider>{ui}</TemperatureUnitProvider>);
}

describe("DailyForecast", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render 7 daily items", () => {
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    const items = screen.getAllByTestId("daily-item");
    expect(items).toHaveLength(7);
  });

  it("should highlight today's item", () => {
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    const items = screen.getAllByTestId("daily-item");
    expect(items[0]).toHaveAttribute("data-today", "true");
    expect(items[1]).toHaveAttribute("data-today", "false");
  });

  it("should display 'Hoje' for today's item", () => {
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    expect(screen.getByText("Hoje")).toBeInTheDocument();
  });

  it("should display day of week for other days", () => {
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    expect(screen.getByText("Terça")).toBeInTheDocument();
    expect(screen.getByText("Quarta")).toBeInTheDocument();
  });

  it("should display min and max temperatures in celsius by default", () => {
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    expect(screen.getByText("18°C")).toBeInTheDocument();
    expect(screen.getByText("28°C")).toBeInTheDocument();
  });

  it("should display temperatures in fahrenheit when stored", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    renderWithProvider(<DailyForecast data={mockDailyData} />);
    expect(screen.getByText("64°F")).toBeInTheDocument();
    expect(screen.getByText("82°F")).toBeInTheDocument();
  });
});
