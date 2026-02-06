import type { DailyForecast as DailyForecastData } from "./weather.types";
import { formatTemperature, isToday } from "./weather.utils";
import { useTemperatureUnit } from "./temperature-unit-context";
import WeatherIcon from "./WeatherIcon";

interface DailyForecastProps {
  data: DailyForecastData[];
}

export default function DailyForecast({ data }: DailyForecastProps) {
  const { unit } = useTemperatureUnit();
  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-4 border border-white/30" data-testid="daily-forecast">
      <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-3">
        Previsão 7 Dias
      </h3>
      <div className="flex flex-col divide-y divide-white/10">
        {data.map((day) => {
          const today = isToday(day.date);
          return (
            <div
              key={day.date}
              className={`flex items-center justify-between py-3 ${today ? "bg-white/10 rounded-xl px-3 -mx-1" : ""}`}
              data-testid="daily-item"
              data-today={today}
            >
              <span className={`text-sm w-24 ${today ? "font-bold text-white" : "text-white/80"}`}>
                {today ? "Hoje" : day.dayOfWeek}
              </span>
              <WeatherIcon weatherCode={day.weatherCode} size={24} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60 w-10 text-right">
                  {formatTemperature(day.temperatureMin, unit)}
                </span>
                <div className="w-16 h-1 rounded-full bg-white/20 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-blue-300 to-orange-300 rounded-full" />
                </div>
                <span className="text-sm font-medium text-white w-10">
                  {formatTemperature(day.temperatureMax, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
