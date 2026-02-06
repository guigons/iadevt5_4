import type { HourlyForecast as HourlyForecastData } from "./weather.types";
import { formatTemperature } from "./weather.utils";
import { useTemperatureUnit } from "./temperature-unit-context";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  data: HourlyForecastData[];
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const { unit } = useTemperatureUnit();
  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-4 border border-white/30" data-testid="hourly-forecast">
      <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Previsão Horária
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin" data-testid="hourly-scroll">
        {data.map((hour) => (
          <div
            key={hour.time}
            className="flex flex-col items-center gap-2 min-w-[60px]"
            data-testid="hourly-item"
          >
            <span className="text-xs text-white/70">{hour.time}</span>
            <WeatherIcon weatherCode={hour.weatherCode} size={24} />
            <span className="text-sm font-medium text-white">
              {formatTemperature(hour.temperature, unit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
