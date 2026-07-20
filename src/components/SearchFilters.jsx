// src/components/SearchFilters.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X } from 'lucide-react';

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
  const [panelOpen, setPanelOpen] = useState(false);
  const isRTL = t('dir') === 'rtl';

  // Heures de 09:00 à 23:00
  const hours = [];
  for (let i = 9; i <= 23; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }

  const advancedCount = [selectedDate, selectedTime, quality, minPrice, maxPrice].filter(Boolean).length;
  const hasActiveFilters = Boolean(query) || advancedCount > 0;

  return (
    <div className={`w-full ${isRTL ? 'text-right' : ''}`}>
      {/* Ligne principale : recherche + bouton filtres. C'est tout ce qu'on voit par défaut. */}
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 min-w-0">
          <Search className={`pointer-events-none absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40`} />
          <input
            type="text"
            inputMode="search"
            placeholder={t('home.filters.searchPlaceholder')}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={`w-full rounded-2xl border border-line bg-white py-3 text-[15px] placeholder:text-ink/40 focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          />
        </div>

        <button
          type="button"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          className={`relative flex shrink-0 items-center gap-1.5 rounded-2xl border py-3 px-3.5 text-sm font-medium transition
            ${panelOpen || advancedCount > 0
              ? 'border-turf bg-turf/10 text-turf-dark'
              : 'border-line bg-white text-ink/70 hover:border-turf/50'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">{t('home.filters.filtersButton', 'Filtres')}</span>
          {advancedCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-turf text-[11px] font-bold text-white">
              {advancedCount}
            </span>
          )}
        </button>
      </div>

      {/* Panneau de filtres avancés, replié par défaut sur mobile */}
      <div
        className={`grid transition-all duration-200 ease-out ${panelOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-line bg-soft/60 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/50">
                  {t('home.filters.dateLabel', 'Date')}
                </label>
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => onDateChange(e.target.value || null)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink/50">
                  {t('home.filters.timeLabel', 'Heure')}
                </label>
                <select
                  value={selectedTime || ''}
                  onChange={(e) => onTimeChange(e.target.value || null)}
                  className="w-full appearance-none rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
                >
                  <option value="">{t('home.filters.allHours')}</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink/50">
                {t('home.filters.quality')}
              </label>
              <select
                value={quality}
                onChange={(e) => onQualityChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
              >
                <option value="">{t('home.filters.allQualities')}</option>
                <option value="excellent">{t('home.filters.excellent')}</option>
                <option value="bon">{t('home.filters.good')}</option>
                <option value="moyen">{t('home.filters.average')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink/50">
                {t('home.filters.priceLabel', 'Prix par heure (MRU)')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t('home.filters.minPrice')}
                  value={minPrice || ''}
                  onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : null)}
                  min="0"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t('home.filters.maxPrice')}
                  value={maxPrice || ''}
                  onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
                  min="0"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
                />
              </div>
            </div>

            <div className={`flex items-center justify-between pt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="text-sm font-medium text-ink/50 hover:text-red-600 disabled:opacity-30 disabled:hover:text-ink/50 transition"
              >
                {t('home.filters.reset')}
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-xl bg-turf px-5 py-2 text-sm font-semibold text-white hover:bg-turf-dark transition"
              >
                {t('home.filters.done', 'Terminé')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Puces de filtres actifs — en scroll horizontal pour ne jamais casser la mise en page mobile */}
      {hasActiveFilters && (
        <div className={`mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
          {query && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              🔍 {query}
              <button onClick={() => onQueryChange('')} className="hover:text-red-500">×</button>
            </span>
          )}
          {quality && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
              {quality === 'excellent' ? '⭐' : quality === 'bon' ? '👍' : '👌'} {quality}
              <button onClick={() => onQualityChange('')} className="hover:text-red-500">×</button>
            </span>
          )}
          {selectedDate && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              📅 {new Date(selectedDate).toLocaleDateString('fr-FR')}
              <button onClick={() => onDateChange(null)} className="hover:text-red-500">×</button>
            </span>
          )}
          {selectedTime && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
              🕐 {selectedTime}
              <button onClick={() => onTimeChange(null)} className="hover:text-red-500">×</button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700">
              💰 {minPrice || '0'}–{maxPrice || '∞'} MRU
              <button onClick={() => { onMinPriceChange(null); onMaxPriceChange(null); }} className="hover:text-red-500">×</button>
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink/50 hover:border-red-200 hover:text-red-600 transition"
          >
            <X className="h-3 w-3" />
            {t('home.filters.reset')}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;