import axios from 'axios';
import { searchCity, fetchForecast, buildWeatherResponse, reverseGeocode } from './weather.service';
import { OpenMeteoForecastResponse } from './weather.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  describe('searchCity', () => {
    it('should return geocoding results for a valid city', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              name: 'São Paulo',
              latitude: -23.5475,
              longitude: -46.6361,
              country: 'Brazil',
              admin1: 'São Paulo',
            },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const results = await searchCity('São Paulo');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('São Paulo');
      expect(results[0].latitude).toBe(-23.5475);
      expect(results[0].longitude).toBe(-46.6361);
      expect(results[0].country).toBe('Brazil');
      expect(results[0].admin1).toBe('São Paulo');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search',
        {
          params: { name: 'São Paulo', count: 10, language: 'pt' },
          timeout: 10000,
        }
      );
    });

    it('should return empty array when city is not found', async () => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });
      const results = await searchCity('CidadeInexistente');
      expect(results).toHaveLength(0);
    });

    it('should return empty array when results is undefined', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });
      const results = await searchCity('CidadeInexistente');
      expect(results).toHaveLength(0);
    });

    it('should propagate axios errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));
      await expect(searchCity('São Paulo')).rejects.toThrow('Network error');
    });
  });

  describe('fetchForecast', () => {
    it('should fetch forecast data for valid coordinates', async () => {
      const mockForecastData: OpenMeteoForecastResponse = {
        hourly: {
          time: ['2025-02-03T12:00'],
          temperature_2m: [25],
          relative_humidity_2m: [65],
          apparent_temperature: [27],
          weather_code: [2],
          wind_speed_10m: [12],
        },
        daily: {
          time: ['2025-02-03'],
          temperature_2m_max: [28],
          temperature_2m_min: [18],
          weather_code: [2],
        },
      };
      mockedAxios.get.mockResolvedValue({ data: mockForecastData });
      const result = await fetchForecast(-23.55, -46.63);
      expect(result).toEqual(mockForecastData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: -23.55,
            longitude: -46.63,
            hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
            daily: 'temperature_2m_max,temperature_2m_min,weather_code',
            timezone: 'auto',
            forecast_days: 7,
          },
          timeout: 10000,
        }
      );
    });

    it('should propagate axios errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API timeout'));
      await expect(fetchForecast(-23.55, -46.63)).rejects.toThrow('API timeout');
    });
  });

  describe('buildWeatherResponse', () => {
    const location = {
      name: 'São Paulo',
      country: 'Brazil',
      latitude: -23.55,
      longitude: -46.63,
    };

    it('should build a complete weather response', () => {
      const now = new Date();
      const currentHour = new Date(now);
      currentHour.setMinutes(0, 0, 0);
      const nextHour = new Date(currentHour.getTime() + 3600000);
      const forecastData: OpenMeteoForecastResponse = {
        hourly: {
          time: [currentHour.toISOString().slice(0, 16), nextHour.toISOString().slice(0, 16)],
          temperature_2m: [25.3, 24.7],
          relative_humidity_2m: [65, 68],
          apparent_temperature: [27.1, 26.5],
          weather_code: [2, 3],
          wind_speed_10m: [12.4, 10.2],
        },
        daily: {
          time: ['2025-02-03'],
          temperature_2m_max: [28.5],
          temperature_2m_min: [17.8],
          weather_code: [2],
        },
      };
      const result = buildWeatherResponse(location, forecastData);
      expect(result.location).toEqual(location);
      expect(result.current.temperature).toBe(25);
      expect(result.current.feelsLike).toBe(27);
      expect(result.current.humidity).toBe(65);
      expect(result.current.windSpeed).toBe(12);
      expect(result.current.weatherCode).toBe(2);
      expect(result.current.weatherDescription).toBe('Parcialmente nublado');
      expect(result.daily).toHaveLength(1);
      expect(result.daily[0].temperatureMin).toBe(18);
      expect(result.daily[0].temperatureMax).toBe(29);
      expect(result.daily[0].date).toBe('2025-02-03');
    });

    it('should use first hour index when no future hour is found', () => {
      const pastTime = '2020-01-01T12:00';
      const forecastData: OpenMeteoForecastResponse = {
        hourly: {
          time: [pastTime],
          temperature_2m: [20],
          relative_humidity_2m: [50],
          apparent_temperature: [22],
          weather_code: [0],
          wind_speed_10m: [5],
        },
        daily: {
          time: ['2020-01-01'],
          temperature_2m_max: [25],
          temperature_2m_min: [15],
          weather_code: [0],
        },
      };
      const result = buildWeatherResponse(location, forecastData);
      expect(result.current.temperature).toBe(20);
      expect(result.current.weatherDescription).toBe('Céu limpo');
    });

    it('should return "Desconhecido" for unknown weather code', () => {
      const now = new Date();
      const currentHour = new Date(now);
      currentHour.setMinutes(0, 0, 0);
      const forecastData: OpenMeteoForecastResponse = {
        hourly: {
          time: [currentHour.toISOString().slice(0, 16)],
          temperature_2m: [20],
          relative_humidity_2m: [50],
          apparent_temperature: [22],
          weather_code: [999],
          wind_speed_10m: [5],
        },
        daily: {
          time: [],
          temperature_2m_max: [],
          temperature_2m_min: [],
          weather_code: [],
        },
      };
      const result = buildWeatherResponse(location, forecastData);
      expect(result.current.weatherDescription).toBe('Desconhecido');
    });

    it('should format daily forecast with correct day of week', () => {
      const forecastData: OpenMeteoForecastResponse = {
        hourly: {
          time: ['2025-02-03T12:00'],
          temperature_2m: [25],
          relative_humidity_2m: [65],
          apparent_temperature: [27],
          weather_code: [2],
          wind_speed_10m: [12],
        },
        daily: {
          time: ['2025-02-03', '2025-02-04'],
          temperature_2m_max: [28, 30],
          temperature_2m_min: [18, 20],
          weather_code: [2, 0],
        },
      };
      const result = buildWeatherResponse(location, forecastData);
      expect(result.daily).toHaveLength(2);
      expect(result.daily[0].dayOfWeek).toBe('Segunda');
      expect(result.daily[1].dayOfWeek).toBe('Terça');
    });
  });

  describe('reverseGeocode (BUG-01 regression)', () => {
    it('should return city name from Nominatim reverse geocoding', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          address: {
            city: 'Florianópolis',
            country: 'Brasil',
          },
        },
      });
      const result = await reverseGeocode(-27.59, -48.55);
      expect(result.name).toBe('Florianópolis');
      expect(result.country).toBe('Brasil');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: { lat: -27.59, lon: -48.55, format: 'json' },
          headers: { 'User-Agent': 'WeatherDashboard/1.0' },
          timeout: 10000,
        }
      );
    });

    it('should fallback to town when city is not available', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          address: {
            town: 'Garopaba',
            country: 'Brasil',
          },
        },
      });
      const result = await reverseGeocode(-28.02, -48.61);
      expect(result.name).toBe('Garopaba');
      expect(result.country).toBe('Brasil');
    });

    it('should fallback to village when city and town are not available', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          address: {
            village: 'Small Village',
            country: 'Brasil',
          },
        },
      });
      const result = await reverseGeocode(-28.5, -49.0);
      expect(result.name).toBe('Small Village');
    });

    it('should fallback to coordinates when no address name is available', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          address: {},
        },
      });
      const result = await reverseGeocode(-27.59, -48.55);
      expect(result.name).toBe('-27.59, -48.55');
      expect(result.country).toBe('');
    });

    it('should propagate errors from Nominatim API', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Nominatim timeout'));
      await expect(reverseGeocode(-27.59, -48.55)).rejects.toThrow('Nominatim timeout');
    });
  });

  describe('searchCity sorting by population (BUG-03 regression)', () => {
    it('should sort results by population descending', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            { name: 'York', latitude: 40.86, longitude: -97.59, country: 'United States', population: 7864 },
            { name: 'New York', latitude: 40.71, longitude: -74.00, country: 'United States', admin1: 'New York', population: 8804190 },
            { name: 'New York', latitude: 53.07, longitude: -0.14, country: 'United Kingdom' },
          ],
        },
      });
      const results = await searchCity('New York');
      expect(results[0].name).toBe('New York');
      expect(results[0].latitude).toBe(40.71);
      expect(results[1].name).toBe('York');
      expect(results[2].country).toBe('United Kingdom');
    });

    it('should treat undefined population as 0 when sorting', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            { name: 'Unknown Town', latitude: 1, longitude: 1, country: 'X' },
            { name: 'Big City', latitude: 2, longitude: 2, country: 'Y', population: 500000 },
          ],
        },
      });
      const results = await searchCity('test');
      expect(results[0].name).toBe('Big City');
      expect(results[1].name).toBe('Unknown Town');
    });

    it('should limit results to 5 after sorting', async () => {
      const manyResults = Array.from({ length: 10 }, (_, i) => ({
        name: `City ${i}`,
        latitude: i,
        longitude: i,
        country: 'Test',
        population: i * 1000,
      }));
      mockedAxios.get.mockResolvedValue({ data: { results: manyResults } });
      const results = await searchCity('City');
      expect(results).toHaveLength(5);
      expect(results[0].name).toBe('City 9');
    });
  });
});
