import {
  getWmoCodeInfo,
  getWeatherDescription,
  getWeatherIcon,
  getWeatherGradient,
  convertCelsiusToFahrenheit,
  convertTemperature,
  formatTemperature,
  formatDate,
  isToday,
} from "./weather.utils";

describe("getWmoCodeInfo", () => {
  it("should return correct info for clear sky (code 0)", () => {
    const info = getWmoCodeInfo(0);
    expect(info.description).toBe("Céu limpo");
    expect(info.icon).toBe("Sun");
    expect(info.gradient).toBe("from-yellow-400 to-orange-500");
  });

  it("should return correct info for partly cloudy (code 2)", () => {
    const info = getWmoCodeInfo(2);
    expect(info.description).toBe("Parcialmente nublado");
    expect(info.icon).toBe("CloudSun");
    expect(info.gradient).toBe("from-blue-400 to-gray-400");
  });

  it("should return correct info for rain (code 63)", () => {
    const info = getWmoCodeInfo(63);
    expect(info.description).toBe("Chuva moderada");
    expect(info.icon).toBe("CloudRain");
    expect(info.gradient).toBe("from-blue-500 to-blue-700");
  });

  it("should return correct info for snow (code 71)", () => {
    const info = getWmoCodeInfo(71);
    expect(info.description).toBe("Neve leve");
    expect(info.icon).toBe("Snowflake");
    expect(info.gradient).toBe("from-blue-100 to-blue-300");
  });

  it("should return correct info for thunderstorm (code 95)", () => {
    const info = getWmoCodeInfo(95);
    expect(info.description).toBe("Tempestade");
    expect(info.icon).toBe("CloudLightning");
    expect(info.gradient).toBe("from-gray-700 to-purple-900");
  });

  it("should return default info for unknown code", () => {
    const info = getWmoCodeInfo(999);
    expect(info.description).toBe("Desconhecido");
    expect(info.icon).toBe("Cloud");
    expect(info.gradient).toBe("from-gray-400 to-gray-600");
  });
});

describe("getWeatherDescription", () => {
  it("should return description for known code", () => {
    expect(getWeatherDescription(0)).toBe("Céu limpo");
    expect(getWeatherDescription(3)).toBe("Nublado");
    expect(getWeatherDescription(45)).toBe("Neblina");
  });

  it("should return 'Desconhecido' for unknown code", () => {
    expect(getWeatherDescription(999)).toBe("Desconhecido");
  });
});

describe("getWeatherIcon", () => {
  it("should return icon name for known codes", () => {
    expect(getWeatherIcon(0)).toBe("Sun");
    expect(getWeatherIcon(2)).toBe("CloudSun");
    expect(getWeatherIcon(3)).toBe("Cloud");
    expect(getWeatherIcon(45)).toBe("CloudFog");
    expect(getWeatherIcon(51)).toBe("CloudDrizzle");
    expect(getWeatherIcon(61)).toBe("CloudRain");
    expect(getWeatherIcon(71)).toBe("Snowflake");
    expect(getWeatherIcon(95)).toBe("CloudLightning");
  });

  it("should return 'Cloud' for unknown code", () => {
    expect(getWeatherIcon(999)).toBe("Cloud");
  });
});

describe("getWeatherGradient", () => {
  it("should return gradient for known codes", () => {
    expect(getWeatherGradient(0)).toBe("from-yellow-400 to-orange-500");
    expect(getWeatherGradient(61)).toBe("from-blue-400 to-blue-600");
  });

  it("should return default gradient for unknown code", () => {
    expect(getWeatherGradient(999)).toBe("from-gray-400 to-gray-600");
  });
});

describe("convertCelsiusToFahrenheit", () => {
  it("should convert 0°C to 32°F", () => {
    expect(convertCelsiusToFahrenheit(0)).toBe(32);
  });

  it("should convert 100°C to 212°F", () => {
    expect(convertCelsiusToFahrenheit(100)).toBe(212);
  });

  it("should convert 20°C to 68°F", () => {
    expect(convertCelsiusToFahrenheit(20)).toBe(68);
  });

  it("should convert negative temperature (-40°C to -40°F)", () => {
    expect(convertCelsiusToFahrenheit(-40)).toBe(-40);
  });

  it("should convert negative temperature (-10°C to 14°F)", () => {
    expect(convertCelsiusToFahrenheit(-10)).toBe(14);
  });

  it("should return precise decimal results", () => {
    expect(convertCelsiusToFahrenheit(25.5)).toBeCloseTo(77.9);
  });
});

describe("convertTemperature", () => {
  it("should return original value for celsius", () => {
    expect(convertTemperature(25, "celsius")).toBe(25);
  });

  it("should convert to fahrenheit when unit is fahrenheit", () => {
    expect(convertTemperature(0, "fahrenheit")).toBe(32);
  });

  it("should return original negative value for celsius", () => {
    expect(convertTemperature(-5, "celsius")).toBe(-5);
  });

  it("should convert negative celsius to fahrenheit", () => {
    expect(convertTemperature(-10, "fahrenheit")).toBe(14);
  });
});

describe("formatTemperature", () => {
  it("should format celsius with °C suffix by default", () => {
    expect(formatTemperature(25)).toBe("25°C");
  });

  it("should format celsius explicitly with °C suffix", () => {
    expect(formatTemperature(25, "celsius")).toBe("25°C");
  });

  it("should format fahrenheit with °F suffix", () => {
    expect(formatTemperature(0, "fahrenheit")).toBe("32°F");
  });

  it("should round decimal temperature in celsius", () => {
    expect(formatTemperature(25.7, "celsius")).toBe("26°C");
    expect(formatTemperature(25.3, "celsius")).toBe("25°C");
  });

  it("should handle negative temperature in celsius", () => {
    expect(formatTemperature(-5, "celsius")).toBe("-5°C");
  });

  it("should handle zero temperature in celsius", () => {
    expect(formatTemperature(0, "celsius")).toBe("0°C");
  });

  it("should convert and format 20°C as 68°F", () => {
    expect(formatTemperature(20, "fahrenheit")).toBe("68°F");
  });

  it("should convert and format 100°C as 212°F", () => {
    expect(formatTemperature(100, "fahrenheit")).toBe("212°F");
  });
});

describe("formatDate", () => {
  it("should format date string to dd/mm", () => {
    const result = formatDate("2025-02-03");
    expect(result).toBe("03/02");
  });

  it("should format another date correctly", () => {
    const result = formatDate("2025-12-25");
    expect(result).toBe("25/12");
  });
});

describe("isToday", () => {
  it("should return true for today's date", () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    expect(isToday(dateString)).toBe(true);
  });

  it("should return false for a past date", () => {
    expect(isToday("2020-01-01")).toBe(false);
  });

  it("should return false for a future date", () => {
    expect(isToday("2099-12-31")).toBe(false);
  });
});
