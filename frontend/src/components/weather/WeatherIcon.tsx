import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { getWeatherIcon } from "./weather.utils";

interface WeatherIconProps {
  weatherCode: number;
  size?: number;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
};

export default function WeatherIcon({ weatherCode, size = 24, className = "" }: WeatherIconProps) {
  const iconName = getWeatherIcon(weatherCode);
  const IconComponent = ICON_MAP[iconName] ?? Cloud;
  return <IconComponent size={size} className={className} data-testid={`weather-icon-${iconName}`} />;
}
