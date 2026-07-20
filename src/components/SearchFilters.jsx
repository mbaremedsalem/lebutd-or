// src/components/SearchFilters.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Clock, X } from 'lucide-react';

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
  const { t } = useTranslation();
  
  // Générer les heures de 09:00 à 23:00
  const hours = [];
  for (let i = 9; i <= 23; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }

  const hasActiveFilters = query || quality || selectedDate || selectedTime || minPrice || maxPrice;

  // Déterminer la direction du texte pour l'arabe
  const isRTL = t('dir') === 'rtl';

  return (
    <div className={`space-y-4 w-full ${isRTL ? 'text-right' : ''}`}>
      {/* Recherche par nom */}
      <div className="relative">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40`} />
        <input
          type="text"
          placeholder={t('home.filters.searchPlaceholder')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={`w-full rounded-xl border border-line bg-white py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm placeholder:text-ink/40 focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition`}
        />
      </div>

      {/* Filtres avancés */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Filtre par date */}
        <div className="relative">
          <Calendar className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40`} />
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value || null)}
            className={`w-full rounded-xl border border-line bg-white py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition`}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Filtre par heure */}
        <div className="relative">
          <Clock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40`} />
          <select
            value={selectedTime || ''}
            onChange={(e) => onTimeChange(e.target.value || null)}
            className={`w-full rounded-xl border border-line bg-white py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition appearance-none`}
          >
            <option value="">{t('home.filters.allHours')}</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </div>

        {/* Filtre prix min */}
        <div className="relative">
          <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs`}>
            MRU
          </span>
          <input
            type="number"
            placeholder={t('home.filters.minPrice')}
            value={minPrice || ''}
            onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : null)}
            className={`w-full rounded-xl border border-line bg-white py-2.5 ${isRTL ? 'pr-12 pl-3' : 'pl-12 pr-3'} text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition`}
            min="0"
          />
        </div>

        {/* Filtre prix max */}
        <div className="relative">
          <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-ink/40 font-bold text-xs`}>
            MRU
          </span>
          <input
            type="number"
            placeholder={t('home.filters.maxPrice')}
            value={maxPrice || ''}
            onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
            className={`w-full rounded-xl border border-line bg-white py-2.5 ${isRTL ? 'pr-12 pl-3' : 'pl-12 pr-3'} text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition`}
            min="0"
          />
        </div>
      </div>

      {/* Deuxième ligne de filtres */}
      <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink/60">{t('home.filters.quality')} :</span>
          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-1.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
          >
            <option value="">{t('home.filters.allQualities')}</option>
            <option value="excellent">{t('home.filters.excellent')}</option>
            <option value="bon">{t('home.filters.good')}</option>
            <option value="moyen">{t('home.filters.average')}</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <X className="h-4 w-4" />
            {t('home.filters.reset')}
          </button>
        )}
      </div>

      {/* Filtres actifs - Tags */}
      {hasActiveFilters && (
        <div className={`flex flex-wrap gap-2 pt-1 border-t border-line pt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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