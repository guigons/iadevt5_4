import { render, screen, fireEvent } from "@testing-library/react";
import WeatherSearch from "./WeatherSearch";

describe("WeatherSearch", () => {
  it("should render search input and button", () => {
    render(<WeatherSearch onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText("Buscar cidade...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  it("should call onSearch with city name on form submit", () => {
    const onSearch = jest.fn();
    render(<WeatherSearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText("Buscar cidade...");
    fireEvent.change(input, { target: { value: "São Paulo" } });
    fireEvent.submit(input.closest("form")!);
    expect(onSearch).toHaveBeenCalledWith("São Paulo");
  });

  it("should not call onSearch when input is empty", () => {
    const onSearch = jest.fn();
    render(<WeatherSearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText("Buscar cidade...");
    fireEvent.submit(input.closest("form")!);
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should not call onSearch when input is whitespace only", () => {
    const onSearch = jest.fn();
    render(<WeatherSearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText("Buscar cidade...");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input.closest("form")!);
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should show hint when showHint is true", () => {
    render(<WeatherSearch onSearch={jest.fn()} showHint />);
    expect(screen.getByText("Digite o nome de uma cidade para ver a previsão do tempo")).toBeInTheDocument();
  });

  it("should not show hint when showHint is false", () => {
    render(<WeatherSearch onSearch={jest.fn()} showHint={false} />);
    expect(screen.queryByText("Digite o nome de uma cidade para ver a previsão do tempo")).not.toBeInTheDocument();
  });

  it("should disable input and button when loading", () => {
    render(<WeatherSearch onSearch={jest.fn()} loading />);
    expect(screen.getByPlaceholderText("Buscar cidade...")).toBeDisabled();
  });
});
