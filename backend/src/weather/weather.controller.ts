import { Request, Response } from 'express';
import { searchCity, fetchForecast, buildWeatherResponse, reverseGeocode } from './weather.service';

export async function getForecast(req: Request, res: Response): Promise<void> {
  const { latitude, longitude, city } = req.query;
  const hasCoordinates = latitude !== undefined && longitude !== undefined;
  const hasCity = city !== undefined && String(city).trim() !== '';
  if (!hasCoordinates && !hasCity) {
    res.status(400).json({
      error: 'Missing required parameters',
      message: 'Provide "latitude" and "longitude" or "city"',
    });
    return;
  }
  try {
    let locationName: string;
    let locationCountry: string;
    let lat: number;
    let lon: number;
    if (hasCity) {
      const results = await searchCity(String(city));
      if (results.length === 0) {
        res.status(404).json({
          error: 'City not found',
          city: String(city),
        });
        return;
      }
      const firstResult = results[0];
      locationName = firstResult.name;
      locationCountry = firstResult.country;
      lat = firstResult.latitude;
      lon = firstResult.longitude;
    } else {
      lat = Number(latitude);
      lon = Number(longitude);
      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({
          error: 'Invalid coordinates',
          message: '"latitude" and "longitude" must be valid numbers',
        });
        return;
      }
      const reverseResult = await reverseGeocode(lat, lon);
      locationName = reverseResult.name;
      locationCountry = reverseResult.country;
    }
    const forecastData = await fetchForecast(lat, lon);
    const weatherResponse = buildWeatherResponse(
      { name: locationName, country: locationCountry, latitude: lat, longitude: lon },
      forecastData
    );
    res.status(200).json(weatherResponse);
  } catch (error) {
    console.error('Failed to fetch weather data', {
      error: error instanceof Error ? error.message : 'Unknown error',
      city: city ? String(city) : undefined,
      latitude,
      longitude,
    });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch weather data',
    });
  }
}

export async function getGeocoding(req: Request, res: Response): Promise<void> {
  const { city } = req.query;
  if (!city || String(city).trim() === '') {
    res.status(400).json({
      error: 'Missing required parameter',
      message: 'Provide "city" parameter',
    });
    return;
  }
  try {
    const results = await searchCity(String(city));
    if (results.length === 0) {
      res.status(404).json({
        error: 'City not found',
        city: String(city),
      });
      return;
    }
    res.status(200).json({ results });
  } catch (error) {
    console.error('Failed to fetch geocoding data', {
      error: error instanceof Error ? error.message : 'Unknown error',
      city: String(city),
    });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch geocoding data',
    });
  }
}
