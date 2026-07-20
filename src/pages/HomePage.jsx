// src/pages/HomePage.jsx
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHalls } from '../hooks/useHalls';
import SearchFilters from '../components/SearchFilters';
import HallList from '../components/HallList';
import LoadingState from '../components/LoadingState';

export default function HomePage() {
  const { t } = useTranslation();
  const { halls, loading: hallsLoading } = useHalls();

  // États des filtres
  const [query, setQuery] = useState('');
  const [quality, setQuality] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const clearFilters = () => {
    setQuery('');
    setQuality('');
    setSelectedDate(null);
    setSelectedTime(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  // Vérifier si une salle est disponible à une date/heure donnée
  const isHallAvailable = (hall, date, time) => {
    if (!date) return true;
    if (!hall.availability || hall.availability.length === 0) return false;

    const day = hall.availability.find((d) => d.date === date);
    if (!day) return false;

    if (time) {
      const slot = day.slots.find((s) => s.time === time);
      return slot ? slot.available : false;
    }
    return day.slots.some((s) => s.available);
  };

  const filteredHalls = useMemo(() => {
    const q = query.trim().toLowerCase();

    return halls.filter((hall) => {
      const matchesQuery = !q ||
        hall.name.toLowerCase().includes(q) ||
        hall.city.toLowerCase().includes(q) ||
        hall.district.toLowerCase().includes(q);

      const matchesQuality = !quality || hall.pitchQuality === quality;

      const matchesPrice = (!minPrice || hall.pricePerHour >= minPrice) &&
                          (!maxPrice || hall.pricePerHour <= maxPrice);

      const matchesAvailability = isHallAvailable(hall, selectedDate, selectedTime);

      return matchesQuery && matchesQuality && matchesPrice && matchesAvailability;
    });
  }, [halls, query, quality, selectedDate, selectedTime, minPrice, maxPrice]);

  const totalAvailableSlots = useMemo(() => {
    let count = 0;
    filteredHalls.forEach((hall) => {
      if (hall.availability) {
        hall.availability.forEach((day) => {
          count += day.slots.filter((s) => s.available).length;
        });
      }
    });
    return count;
  }, [filteredHalls]);

  const hasActiveFilters = query || quality || selectedDate || selectedTime || minPrice || maxPrice;

  return (
    <div dir={t('dir')}>
      {/* Barre de recherche collante : c'est la première chose que voit l'utilisateur sur mobile,
          et elle reste accessible pendant le scroll dans la liste des salles. */}
      <div className="sticky top-0 z-20 border-b border-line bg-chalk/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 pt-3 pb-3 sm:px-5">
          <h1 className="mb-2.5 font-display text-lg font-semibold text-ink sm:text-xl">
            {t('home.title')}
          </h1>
          <SearchFilters
            query={query}
            onQueryChange={setQuery}
            quality={quality}
            onQualityChange={setQuality}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-5">
        <div className="mb-4">
          <p className="text-sm text-ink/60">
            <span className="font-semibold text-ink">{filteredHalls.length}</span>{' '}
            {t('home.results', { count: filteredHalls.length })}
          </p>
          {selectedDate && (
            <p className="mt-0.5 text-xs text-ink/45">
              {t('home.availableOn')} {new Date(selectedDate).toLocaleDateString(
                t('locale') === 'ar' ? 'ar-MA' : 'fr-FR'
              )}
              {selectedTime && ` ${t('home.at')} ${selectedTime}`}
              {totalAvailableSlots > 0 && ` · ${totalAvailableSlots} ${t('home.slotsAvailable')}`}
            </p>
          )}
        </div>

        {hallsLoading ? (
          <LoadingState label={t('home.loading')} />
        ) : filteredHalls.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-display text-xl text-ink/60">{t('home.noHallsFound')}</p>
            <p className="mt-2 text-sm text-ink/40 max-w-md mx-auto">
              {hasActiveFilters ? t('home.noResults') : t('home.tryModifyFilters')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-turf px-6 py-2.5 text-sm font-medium text-white hover:bg-turf-dark transition"
              >
                {t('home.resetFilters')}
              </button>
            )}
          </div>
        ) : (
          <HallList halls={filteredHalls} />
        )}
      </div>
    </div>
  );
}