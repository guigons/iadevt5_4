import { render, screen } from "@testing-library/react";
import CurrentWeather from "./CurrentWeather";
import { TemperatureUnitProvider } from "./temperature-unit-context";
import type { CurrentWeather as CurrentWeatherData, WeatherLocation } from "./weather.types";

const mockWeatherData: CurrentWeatherData = {
  temperature: 25,
  feelsLike: 27,
  humidity: 65,
  windSpeed: 12,
  weatherCode: 2,
  weatherDescription: "Parcialmente nublado",
};

const mockLocation: WeatherLocation = {
  name: "São Paulo",
  country: "Brazil",
  latitude: -23.55,
  longitude: -46.63,
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<TemperatureUnitProvider>{ui}</TemperatureUnitProvider>);
}

describe("CurrentWeather", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render city and country", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("location-name")).toHaveTextContent("São Paulo, Brazil");
  });

  it("should render temperature in celsius by default", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("temperature")).toHaveTextContent("25°C");
  });

  it("should render temperature in fahrenheit when stored", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("temperature")).toHaveTextContent("77°F");
  });

  it("should render weather description", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("weather-description")).toHaveTextContent("Parcialmente nublado");
  });

  it("should render feels like temperature in celsius", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("feels-like")).toHaveTextContent("27°C");
  });

  it("should render feels like temperature in fahrenheit when stored", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("feels-like")).toHaveTextContent("81°F");
  });

  it("should render humidity", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("humidity")).toHaveTextContent("65%");
  });

  it("should render wind speed", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    expect(screen.getByTestId("wind-speed")).toHaveTextContent("12 km/h");
  });

  it("should have flex-wrap on weather pills container to prevent overflow (BUG-02 regression)", () => {
    renderWithProvider(<CurrentWeather data={mockWeatherData} location={mockLocation} />);
    const pillsContainer = screen.getByTestId("weather-pills");
    expect(pillsContainer.className).toContain("flex-wrap");
  });
});
