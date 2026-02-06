import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { TemperatureUnit } from "./weather.types";

const STORAGE_KEY = "temperatureUnit";

interface TemperatureUnitContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

const TemperatureUnitContext = createContext<TemperatureUnitContextType | undefined>(undefined);

function readStoredUnit(): TemperatureUnit {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "fahrenheit") return "fahrenheit";
  return "celsius";
}

interface TemperatureUnitProviderProps {
  children: ReactNode;
}

export function TemperatureUnitProvider({ children }: TemperatureUnitProviderProps) {
  const [unit, setUnit] = useState<TemperatureUnit>(readStoredUnit);
  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "celsius" ? "fahrenheit" : "celsius";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);
  return (
    <TemperatureUnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnit(): TemperatureUnitContextType {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error("useTemperatureUnit must be used within TemperatureUnitProvider");
  }
  return context;
}
