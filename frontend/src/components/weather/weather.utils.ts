import type { TemperatureUnit } from "./weather.types";

export interface WmoCodeInfo {
  description: string;
  icon: string;
  gradient: string;
}

const WMO_CODES: Record<number, WmoCodeInfo> = {
  0: { description: "Céu limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  1: { description: "Principalmente limpo", icon: "Sun", gradient: "from-yellow-400 to-orange-500" },
  2: { description: "Parcialmente nublado", icon: "CloudSun", gradient: "from-blue-400 to-gray-400" },
  3: { description: "Nublado", icon: "Cloud", gradient: "from-gray-400 to-gray-600" },
  45: { description: "Neblina", icon: "CloudFog", gradient: "from-gray-300 to-gray-500" },
  48: { description: "Neblina com geada", icon: "CloudFog", gradient: "from-gray-300 to-blue-300" },
  51: { description: "Garoa leve", icon: "CloudDrizzle", gradient: "from-gray-400 to-blue-500" },
  53: { description: "Garoa moderada", icon: "CloudDrizzle", gradient: "from-gray-500 to-blue-600" },
  55: { description: "Garoa intensa", icon: "CloudDrizzle", gradient: "from-gray-600 to-blue-700" },
  61: { description: "Chuva leve", icon: "CloudRain", gradient: "from-blue-400 to-blue-600" },
  63: { description: "Chuva moderada", icon: "CloudRain", gradient: "from-blue-500 to-blue-700" },
  65: { description: "Chuva forte", icon: "CloudRain", gradient: "from-blue-600 to-blue-800" },
  71: { description: "Neve leve", icon: "Snowflake", gradient: "from-blue-100 to-blue-300" },
  73: { description: "Neve moderada", icon: "Snowflake", gradient: "from-blue-200 to-blue-400" },
  75: { description: "Neve forte", icon: "Snowflake", gradient: "from-blue-300 to-blue-500" },
  95: { description: "Tempestade", icon: "CloudLightning", gradient: "from-gray-700 to-purple-900" },
  96: { description: "Tempestade com granizo", icon: "CloudLightning", gradient: "from-gray-800 to-purple-900" },
  99: { description: "Tempestade com granizo forte", icon: "CloudLightning", gradient: "from-gray-900 to-purple-900" },
};

const DEFAULT_WMO_INFO: WmoCodeInfo = {
  description: "Desconhecido",
  icon: "Cloud",
  gradient: "from-gray-400 to-gray-600",
};

export function getWmoCodeInfo(code: number): WmoCodeInfo {
  return WMO_CODES[code] ?? DEFAULT_WMO_INFO;
}

export function getWeatherDescription(code: number): string {
  return getWmoCodeInfo(code).description;
}

export function getWeatherIcon(code: number): string {
  return getWmoCodeInfo(code).icon;
}

export function getWeatherGradient(code: number): string {
  return getWmoCodeInfo(code).gradient;
}

export function convertCelsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === "celsius") return celsius;
  return convertCelsiusToFahrenheit(celsius);
}

export function formatTemperature(temperature: number, unit: TemperatureUnit = "celsius"): string {
  const converted = convertTemperature(temperature, unit);
  const suffix = unit === "celsius" ? "°C" : "°F";
  return `${Math.round(converted)}${suffix}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString + "T00:00:00");
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
