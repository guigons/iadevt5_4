export interface WeatherRequest {
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

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

export interface WeatherResponse {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    population?: number;
  }>;
}

export interface NominatimReverseResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
  };
}

export interface OpenMeteoForecastResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}
