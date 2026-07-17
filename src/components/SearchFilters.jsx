import { Search } from 'lucide-react';

export default function SearchFilters({ query, onQueryChange, quality, onQualityChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="focus-ring flex flex-1 items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher par ville, quartier ou nom de salle…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
      </label>

      <select
        value={quality}
        onChange={(e) => onQualityChange(e.target.value)}
        className="focus-ring rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink/80"
      >
        <option value="">Tous les états de terrain</option>
        <option value="excellent">Excellent état</option>
        <option value="bon">Bon état</option>
        <option value="moyen">État moyen</option>
        <option value="a_renover">À rénover</option>
      </select>
    </div>
  );
}
