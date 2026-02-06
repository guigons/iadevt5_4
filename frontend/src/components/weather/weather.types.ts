export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
}

export interface WeatherLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface GeolocationState {
  coordinates: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export interface WeatherState {
  data: WeatherData | null;
  error: string | null;
  loading: boolean;
}
