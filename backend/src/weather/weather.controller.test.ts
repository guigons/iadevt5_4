import request from 'supertest';
import { app } from '../index';
import * as weatherService from './weather.service';
import { OpenMeteoForecastResponse } from './weather.types';

jest.mock('./weather.service');
const mockedService = weatherService as jest.Mocked<typeof weatherService>;

const mockForecastData: OpenMeteoForecastResponse = {
  hourly: {
    time: ['2025-02-03T12:00', '2025-02-03T13:00'],
    temperature_2m: [25, 24],
    relative_humidity_2m: [65, 68],
    apparent_temperature: [27, 26],
    weather_code: [2, 3],
    wind_speed_10m: [12, 10],
  },
  daily: {
    time: ['2025-02-03'],
    temperature_2m_max: [28],
    temperature_2m_min: [18],
    weather_code: [2],
  },
};

const mockWeatherResponse = {
  location: {
    name: 'São Paulo',
    country: 'Brazil',
    latitude: -23.55,
    longitude: -46.63,
  },
  current: {
    temperature: 25,
    feelsLike: 27,
    humidity: 65,
    windSpeed: 12,
    weatherCode: 2,
    weatherDescription: 'Parcialmente nublado',
  },
  hourly: [{ time: '12:00', temperature: 25, weatherCode: 2 }],
  daily: [{ date: '2025-02-03', dayOfWeek: 'Segunda', temperatureMin: 18, temperatureMax: 28, weatherCode: 2 }],
};

describe('Weather Controller - Integration Tests', () => {
  describe('GET /api/weather/forecast', () => {
    it('should return 200 with weather data for a valid city', async () => {
      mockedService.searchCity.mockResolvedValue([{
        name: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        country: 'Brazil',
        admin1: 'São Paulo',
      }]);
      mockedService.fetchForecast.mockResolvedValue(mockForecastData);
      mockedService.buildWeatherResponse.mockReturnValue(mockWeatherResponse);
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ city: 'São Paulo' });
      expect(response.status).toBe(200);
      expect(response.body.location.name).toBe('São Paulo');
      expect(response.body.current.temperature).toBe(25);
      expect(mockedService.searchCity).toHaveBeenCalledWith('São Paulo');
    });

    it('should return 200 with weather data for valid coordinates', async () => {
      mockedService.reverseGeocode.mockResolvedValue({ name: 'São Paulo', country: 'Brazil' });
      mockedService.fetchForecast.mockResolvedValue(mockForecastData);
      mockedService.buildWeatherResponse.mockReturnValue(mockWeatherResponse);
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ latitude: '-23.55', longitude: '-46.63' });
      expect(response.status).toBe(200);
      expect(response.body.current.temperature).toBe(25);
      expect(mockedService.fetchForecast).toHaveBeenCalledWith(-23.55, -46.63);
    });

    it('should use reverse geocoding to resolve coordinates to city name (BUG-01 regression)', async () => {
      mockedService.reverseGeocode.mockResolvedValue({ name: 'Florianópolis', country: 'Brasil' });
      mockedService.fetchForecast.mockResolvedValue(mockForecastData);
      mockedService.buildWeatherResponse.mockReturnValue({
        ...mockWeatherResponse,
        location: { name: 'Florianópolis', country: 'Brasil', latitude: -27.59, longitude: -48.55 },
      });
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ latitude: '-27.59', longitude: '-48.55' });
      expect(response.status).toBe(200);
      expect(mockedService.reverseGeocode).toHaveBeenCalledWith(-27.59, -48.55);
      expect(mockedService.buildWeatherResponse).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Florianópolis', country: 'Brasil' }),
        expect.anything()
      );
    });

    it('should return 400 when no parameters are provided', async () => {
      const response = await request(app)
        .get('/api/weather/forecast');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required parameters');
    });

    it('should return 400 when city is empty string', async () => {
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ city: '   ' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required parameters');
    });

    it('should return 400 when coordinates are invalid', async () => {
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ latitude: 'abc', longitude: 'xyz' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid coordinates');
    });

    it('should return 404 when city is not found', async () => {
      mockedService.searchCity.mockResolvedValue([]);
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ city: 'CidadeInexistente' });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('City not found');
      expect(response.body.city).toBe('CidadeInexistente');
    });

    it('should return 500 when external API fails', async () => {
      mockedService.searchCity.mockRejectedValue(new Error('API timeout'));
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ city: 'São Paulo' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/weather/geocoding', () => {
    it('should return 200 with geocoding results for a valid city', async () => {
      mockedService.searchCity.mockResolvedValue([{
        name: 'São Paulo',
        latitude: -23.5475,
        longitude: -46.6361,
        country: 'Brazil',
        admin1: 'São Paulo',
      }]);
      const response = await request(app)
        .get('/api/weather/geocoding')
        .query({ city: 'São Paulo' });
      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(1);
      expect(response.body.results[0].name).toBe('São Paulo');
    });

    it('should return 400 when city parameter is missing', async () => {
      const response = await request(app)
        .get('/api/weather/geocoding');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required parameter');
    });

    it('should return 400 when city is empty string', async () => {
      const response = await request(app)
        .get('/api/weather/geocoding')
        .query({ city: '   ' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required parameter');
    });

    it('should return 404 when city is not found', async () => {
      mockedService.searchCity.mockResolvedValue([]);
      const response = await request(app)
        .get('/api/weather/geocoding')
        .query({ city: 'CidadeInexistente' });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('City not found');
    });

    it('should return 500 when external API fails', async () => {
      mockedService.searchCity.mockRejectedValue(new Error('Network error'));
      const response = await request(app)
        .get('/api/weather/geocoding')
        .query({ city: 'São Paulo' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});
