import { renderHook, act } from "@testing-library/react";
import { useWeather } from "./weather.hooks";
import type { WeatherData } from "./weather.types";

const mockWeatherData: WeatherData = {
  location: { name: "São Paulo", country: "Brazil", latitude: -23.55, longitude: -46.63 },
  current: {
    temperature: 25,
    feelsLike: 27,
    humidity: 65,
    windSpeed: 12,
    weatherCode: 2,
    weatherDescription: "Parcialmente nublado",
  },
  hourly: [{ time: "14:00", temperature: 25, weatherCode: 2 }],
  daily: [{ date: "2025-02-03", dayOfWeek: "Segunda", temperatureMin: 18, temperatureMax: 28, weatherCode: 2 }],
};

function createMockResponse(body: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

const mockFetch = global.fetch as jest.Mock;

describe("useWeather", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should have initial state with loading false, data null, error null", () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should set loading to true during fetchByCity", async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => { resolveFetch = resolve; });
    mockFetch.mockReturnValue(fetchPromise);
    const { result } = renderHook(() => useWeather());
    act(() => {
      result.current.fetchByCity("São Paulo");
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
      resolveFetch(createMockResponse(mockWeatherData, 200));
    });
  });

  it("should set data on successful fetchByCity", async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockWeatherData, 200));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCity("São Paulo");
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  it("should set error on 404 response for fetchByCity", async () => {
    mockFetch.mockResolvedValue(createMockResponse({ error: "Not found" }, 404));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCity("CidadeInexistente");
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Cidade não encontrada. Tente outro nome.");
  });

  it("should set error on non-404 error response for fetchByCity", async () => {
    mockFetch.mockResolvedValue(createMockResponse({ error: "Server error" }, 500));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCity("São Paulo");
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Erro ao buscar dados climáticos");
  });

  it("should set error on network failure for fetchByCity", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCity("São Paulo");
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Erro de conexão com o servidor");
  });

  it("should set data on successful fetchByCoordinates", async () => {
    mockFetch.mockResolvedValue(createMockResponse(mockWeatherData, 200));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCoordinates(-23.55, -46.63);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  it("should set error on failed fetchByCoordinates", async () => {
    mockFetch.mockResolvedValue(createMockResponse({ error: "Server error" }, 500));
    const { result } = renderHook(() => useWeather());
    await act(async () => {
      await result.current.fetchByCoordinates(-23.55, -46.63);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Erro ao buscar dados climáticos");
  });
});
