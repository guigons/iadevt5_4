import { useState, useEffect, useCallback } from "react";
import type { WeatherData, GeolocationState, WeatherState } from "./weather.types";

const API_BASE_URL = "/api/weather";

export function useGeolocation(): GeolocationState & { requestPermission: () => void } {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });
  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ coordinates: null, error: "Geolocalização não disponível no navegador", loading: false });
      return;
    }
    setState(prev => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (error) => {
        const errorMessages: Record<number, string> = {
          1: "Permissão de geolocalização negada",
          2: "Posição indisponível",
          3: "Tempo esgotado ao obter localização",
        };
        setState({
          coordinates: null,
          error: errorMessages[error.code] ?? "Erro ao obter localização",
          loading: false,
        });
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, []);
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);
  return { ...state, requestPermission };
}

export function useWeather(): WeatherState & {
  fetchByCity: (city: string) => Promise<void>;
  fetchByCoordinates: (latitude: number, longitude: number) => Promise<void>;
} {
  const [state, setState] = useState<WeatherState>({
    data: null,
    error: null,
    loading: false,
  });
  const fetchByCity = useCallback(async (city: string) => {
    setState({ data: null, error: null, loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/forecast?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        if (response.status === 404) {
          setState({ data: null, error: "Cidade não encontrada. Tente outro nome.", loading: false });
          return;
        }
        setState({ data: null, error: "Erro ao buscar dados climáticos", loading: false });
        return;
      }
      const data: WeatherData = await response.json();
      setState({ data, error: null, loading: false });
    } catch {
      setState({ data: null, error: "Erro de conexão com o servidor", loading: false });
    }
  }, []);
  const fetchByCoordinates = useCallback(async (latitude: number, longitude: number) => {
    setState({ data: null, error: null, loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) {
        setState({ data: null, error: "Erro ao buscar dados climáticos", loading: false });
        return;
      }
      const data: WeatherData = await response.json();
      setState({ data, error: null, loading: false });
    } catch {
      setState({ data: null, error: "Erro de conexão com o servidor", loading: false });
    }
  }, []);
  return { ...state, fetchByCity, fetchByCoordinates };
}
