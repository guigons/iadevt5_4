import axios from 'axios';
import {
  GeocodingResult,
  WeatherResponse,
  HourlyForecast,
  DailyForecast,
  OpenMeteoGeocodingResponse,
  OpenMeteoForecastResponse,
  NominatimReverseResponse,
} from './weather.types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';
const TIMEOUT_MS = 10000;

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Principalmente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva leve',
  81: 'Pancadas de chuva moderada',
  82: 'Pancadas de chuva forte',
  85: 'Pancadas de neve leve',
  86: 'Pancadas de neve forte',
  95: 'Tempestade',
  96: 'Tempestade com granizo',
  99: 'Tempestade com granizo forte',
};

const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

function getWeatherDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? 'Desconhecido';
}

function formatHourlyForecast(data: OpenMeteoForecastResponse): HourlyForecast[] {
  const now = new Date();
  const next24Hours = data.hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => new Date(time) >= now)
    .slice(0, 24);
  return next24Hours.map(({ time, index }) => ({
    time: new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    temperature: Math.round(data.hourly.temperature_2m[index]),
    weatherCode: data.hourly.weather_code[index],
  }));
}

function formatDailyForecast(data: OpenMeteoForecastResponse): DailyForecast[] {
  return data.daily.time.map((date, index) => {
    const dateObj = new Date(date + 'T12:00:00');
    return {
      date,
      dayOfWeek: DAYS_OF_WEEK[dateObj.getDay()],
      temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
      temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
      weatherCode: data.daily.weather_code[index],
    };
  });
}

export async function searchCity(city: string): Promise<GeocodingResult[]> {
  console.log('Geocoding requested', { city });
  const response = await axios.get<OpenMeteoGeocodingResponse>(GEOCODING_API_URL, {
    params: { name: city, count: 10, language: 'pt' },
    timeout: TIMEOUT_MS,
  });
  if (!response.data.results || response.data.results.length === 0) {
    return [];
  }
  const sorted = [...response.data.results].sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0)
  );
  return sorted.slice(0, 5).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ name: string; country: string }> {
  console.log('Reverse geocoding requested', { latitude, longitude });
  const response = await axios.get<NominatimReverseResponse>(REVERSE_GEOCODING_API_URL, {
    params: { lat: latitude, lon: longitude, format: 'json' },
    headers: { 'User-Agent': 'WeatherDashboard/1.0' },
    timeout: TIMEOUT_MS,
  });
  const address = response.data.address;
  const name = address.city || address.town || address.village || address.municipality || `${latitude}, ${longitude}`;
  const country = address.country || '';
  return { name, country };
}

export async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<OpenMeteoForecastResponse> {
  console.log('Forecast requested', { latitude, longitude });
  const response = await axios.get<OpenMeteoForecastResponse>(FORECAST_API_URL, {
    params: {
      latitude,
      longitude,
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      timezone: 'auto',
      forecast_days: 7,
    },
    timeout: TIMEOUT_MS,
  });
  return response.data;
}

export function buildWeatherResponse(
  location: { name: string; country: string; latitude: number; longitude: number },
  forecastData: OpenMeteoForecastResponse
): WeatherResponse {
  const now = new Date();
  const currentHourIndex = forecastData.hourly.time.findIndex(
    (time) => new Date(time) >= now
  );
  const index = currentHourIndex >= 0 ? currentHourIndex : 0;
  return {
    location,
    current: {
      temperature: Math.round(forecastData.hourly.temperature_2m[index]),
      feelsLike: Math.round(forecastData.hourly.apparent_temperature[index]),
      humidity: Math.round(forecastData.hourly.relative_humidity_2m[index]),
      windSpeed: Math.round(forecastData.hourly.wind_speed_10m[index]),
      weatherCode: forecastData.hourly.weather_code[index],
      weatherDescription: getWeatherDescription(forecastData.hourly.weather_code[index]),
    },
    hourly: formatHourlyForecast(forecastData),
    daily: formatDailyForecast(forecastData),
  };
}
