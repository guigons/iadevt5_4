import { Droplets, Wind, Thermometer } from "lucide-react";
import type { CurrentWeather as CurrentWeatherData, WeatherLocation } from "./weather.types";
import { formatTemperature } from "./weather.utils";
import { useTemperatureUnit } from "./temperature-unit-context";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  location: WeatherLocation;
}

export default function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const { unit } = useTemperatureUnit();
  return (
    <div className="text-center text-white">
      <h2 className="text-2xl font-medium" data-testid="location-name">
        {location.name}, {location.country}
      </h2>
      <div className="flex items-center justify-center gap-4 mt-4">
        <WeatherIcon weatherCode={data.weatherCode} size={64} />
        <span className="text-8xl font-thin tracking-tighter" data-testid="temperature">
          {formatTemperature(data.temperature, unit)}
        </span>
      </div>
      <p className="text-xl text-white/80 mt-2" data-testid="weather-description">
        {data.weatherDescription}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 px-2" data-testid="weather-pills">
        <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 rounded-xl px-3 py-2">
          <Thermometer size={18} className="text-white/70" />
          <span className="text-sm text-white/70">Sensação</span>
          <span className="text-sm font-medium" data-testid="feels-like">
            {formatTemperature(data.feelsLike, unit)}
          </span>
        </div>
        <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 rounded-xl px-3 py-2">
          <Droplets size={18} className="text-white/70" />
          <span className="text-sm text-white/70">Umidade</span>
          <span className="text-sm font-medium" data-testid="humidity">
            {data.humidity}%
          </span>
        </div>
        <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 rounded-xl px-3 py-2">
          <Wind size={18} className="text-white/70" />
          <span className="text-sm text-white/70">Vento</span>
          <span className="text-sm font-medium" data-testid="wind-speed">
            {data.windSpeed} km/h
          </span>
        </div>
      </div>
    </div>
  );
}
