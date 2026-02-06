import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useGeolocation, useWeather } from "./weather.hooks";
import { getWeatherGradient } from "./weather.utils";
import { TemperatureUnitProvider } from "./temperature-unit-context";
import WeatherSearch from "./WeatherSearch";
import TemperatureToggle from "./TemperatureToggle";
import CurrentWeather from "./CurrentWeather";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";

export default function WeatherDashboard() {
  const geolocation = useGeolocation();
  const weather = useWeather();
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (geolocation.coordinates && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      weather.fetchByCoordinates(geolocation.coordinates.latitude, geolocation.coordinates.longitude);
    }
  }, [geolocation.coordinates, weather]);
  const handleSearch = (city: string) => {
    weather.fetchByCity(city);
  };
  const gradient = weather.data
    ? getWeatherGradient(weather.data.current.weatherCode)
    : "from-blue-500 to-blue-700";
  const showSearchHint = !geolocation.loading && !geolocation.coordinates && !weather.data;
  return (
    <TemperatureUnitProvider>
      <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000 p-4 md:p-8`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <WeatherSearch
                onSearch={handleSearch}
                loading={weather.loading}
                showHint={showSearchHint}
              />
            </div>
            <TemperatureToggle />
          </div>
          {weather.loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={48} className="text-white animate-spin" />
            </div>
          )}
          {weather.error && (
            <div className="text-center py-10">
              <p className="text-white/80 text-lg" data-testid="weather-error">{weather.error}</p>
            </div>
          )}
          {weather.data && !weather.loading && (
            <>
              <CurrentWeather data={weather.data.current} location={weather.data.location} />
              <HourlyForecast data={weather.data.hourly} />
              <DailyForecast data={weather.data.daily} />
            </>
          )}
          {!weather.data && !weather.loading && !weather.error && !geolocation.loading && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">
                {geolocation.coordinates
                  ? "Carregando dados climáticos..."
                  : "Busque uma cidade para ver a previsão do tempo"}
              </p>
            </div>
          )}
        </div>
      </div>
    </TemperatureUnitProvider>
  );
}
