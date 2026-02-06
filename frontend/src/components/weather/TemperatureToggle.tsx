import { useTemperatureUnit } from "./temperature-unit-context";

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperatureUnit();
  return (
    <div className="flex backdrop-blur-md bg-white/20 rounded-xl border border-white/30 overflow-hidden" data-testid="temperature-toggle">
      <button
        type="button"
        onClick={unit === "fahrenheit" ? toggleUnit : undefined}
        className={`px-3 py-2 text-sm font-medium transition-all ${
          unit === "celsius"
            ? "bg-white/30 text-white"
            : "text-white/60 hover:text-white/80"
        }`}
        data-testid="toggle-celsius"
        aria-pressed={unit === "celsius"}
      >
        °C
      </button>
      <button
        type="button"
        onClick={unit === "celsius" ? toggleUnit : undefined}
        className={`px-3 py-2 text-sm font-medium transition-all ${
          unit === "fahrenheit"
            ? "bg-white/30 text-white"
            : "text-white/60 hover:text-white/80"
        }`}
        data-testid="toggle-fahrenheit"
        aria-pressed={unit === "fahrenheit"}
      >
        °F
      </button>
    </div>
  );
}
