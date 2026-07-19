// src/components/SearchFilters.jsx
import React from 'react';
import { Search, Calendar, Clock, X } from 'lucide-react';

// 💰 Icône MRU personnalisée
const MRUIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <text x="4" y="18" fontSize="16" fontWeight="bold" fill="currentColor">MRU</text>
  </svg>
);

const SearchFilters = ({
  query,
  onQueryChange,
  quality,
  onQualityChange,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onClearFilters
}) => {
  // Générer les heures de 09:00 à 23:00
  const hours = [];
  for (let i = 9; i <= 23; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }

  const hasActiveFilters = query || quality || selectedDate || selectedTime || minPrice || maxPrice;

  return (
    <div className="space-y-4 w-full">
      {/* Recherche par nom */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder="Rechercher une salle par nom, ville ou quartier..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-ink/40 focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
        />
      </div>

      {/* Filtres avancés */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Filtre par date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value || null)}
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Filtre par heure */}
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <select
            value={selectedTime || ''}
            onChange={(e) => onTimeChange(e.target.value || null)}
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition appearance-none"
          >
            <option value="">Toutes les heures</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </div>

        {/* Filtre prix min - MRU */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs">
            MRU
          </span>
          <input
            type="number"
            placeholder="Prix min"
            value={minPrice || ''}
            onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-12 pr-3 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
            min="0"
          />
        </div>

        {/* Filtre prix max - MRU */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs">
            MRU
          </span>
          <input
            type="number"
            placeholder="Prix max"
            value={maxPrice || ''}
            onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-12 pr-3 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
            min="0"
          />
        </div>
      </div>

      {/* Deuxième ligne de filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink/60">État :</span>
          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-1.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
          >
            <option value="">Tous</option>
            <option value="excellent">⭐ Excellent</option>
            <option value="bon">👍 Bon</option>
            <option value="moyen">👌 Moyen</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filtres actifs - Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-line pt-3">
          {query && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              🔍 {query}
              <button onClick={() => onQueryChange('')} className="hover:text-red-500">
                ×
              </button>
            </span>
          )}
          {quality && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              {quality === 'excellent' ? '⭐' : quality === 'bon' ? '👍' : '👌'} {quality}
              <button onClick={() => onQualityChange('')} className="hover:text-red-500">
                ×
              </button>
            </span>
          )}
          {selectedDate && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              📅 {new Date(selectedDate).toLocaleDateString('fr-FR')}
              <button onClick={() => onDateChange(null)} className="hover:text-red-500">
                ×
              </button>
            </span>
          )}
          {selectedTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              🕐 {selectedTime}
              <button onClick={() => onTimeChange(null)} className="hover:text-red-500">
                ×
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
              💰 {minPrice || '0'} - {maxPrice || '∞'} MRU
              <button onClick={() => { onMinPriceChange(null); onMaxPriceChange(null); }} className="hover:text-red-500">
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;