import { render, screen } from "@testing-library/react";
import WeatherIcon from "./WeatherIcon";

describe("WeatherIcon", () => {
  it("should render Sun icon for code 0", () => {
    render(<WeatherIcon weatherCode={0} />);
    expect(screen.getByTestId("weather-icon-Sun")).toBeInTheDocument();
  });

  it("should render CloudSun icon for code 2", () => {
    render(<WeatherIcon weatherCode={2} />);
    expect(screen.getByTestId("weather-icon-CloudSun")).toBeInTheDocument();
  });

  it("should render Cloud icon for code 3", () => {
    render(<WeatherIcon weatherCode={3} />);
    expect(screen.getByTestId("weather-icon-Cloud")).toBeInTheDocument();
  });

  it("should render CloudFog icon for code 45", () => {
    render(<WeatherIcon weatherCode={45} />);
    expect(screen.getByTestId("weather-icon-CloudFog")).toBeInTheDocument();
  });

  it("should render CloudDrizzle icon for code 51", () => {
    render(<WeatherIcon weatherCode={51} />);
    expect(screen.getByTestId("weather-icon-CloudDrizzle")).toBeInTheDocument();
  });

  it("should render CloudRain icon for code 61", () => {
    render(<WeatherIcon weatherCode={61} />);
    expect(screen.getByTestId("weather-icon-CloudRain")).toBeInTheDocument();
  });

  it("should render Snowflake icon for code 71", () => {
    render(<WeatherIcon weatherCode={71} />);
    expect(screen.getByTestId("weather-icon-Snowflake")).toBeInTheDocument();
  });

  it("should render CloudLightning icon for code 95", () => {
    render(<WeatherIcon weatherCode={95} />);
    expect(screen.getByTestId("weather-icon-CloudLightning")).toBeInTheDocument();
  });

  it("should render Cloud icon for unknown code", () => {
    render(<WeatherIcon weatherCode={999} />);
    expect(screen.getByTestId("weather-icon-Cloud")).toBeInTheDocument();
  });

  it("should apply custom size", () => {
    const { container } = render(<WeatherIcon weatherCode={0} size={48} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });

  it("should apply custom className", () => {
    const { container } = render(<WeatherIcon weatherCode={0} className="text-red-500" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-red-500");
  });
});
