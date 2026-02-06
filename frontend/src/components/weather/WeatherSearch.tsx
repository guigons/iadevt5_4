import { useState } from "react";
import { Search } from "lucide-react";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  loading?: boolean;
  showHint?: boolean;
}

export default function WeatherSearch({ onSearch, loading = false, showHint = false }: WeatherSearchProps) {
  const [city, setCity] = useState("");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;
    onSearch(trimmedCity);
  };
  return (
    <div className="w-full max-w-md mx-auto">
      {showHint && (
        <p className="text-white/70 text-sm text-center mb-3">
          Digite o nome de uma cidade para ver a previsão do tempo
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Buscar cidade..."
          className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="px-4 py-3 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
}
