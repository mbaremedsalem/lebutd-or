// src/pages/HomePage.jsx
import { useMemo, useState } from 'react';
import { useHalls } from '../hooks/useHalls';
import { useBanners } from '../hooks/useBanners';
import BannerCarousel from '../components/BannerCarousel';
import SearchFilters from '../components/SearchFilters';
import HallList from '../components/HallList';
import LoadingState from '../components/LoadingState';

export default function HomePage() {
  const { halls, loading: hallsLoading } = useHalls();
  const { banners, loading: bannersLoading } = useBanners();
  
  // États des filtres
  const [query, setQuery] = useState('');
  const [quality, setQuality] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  // Fonction pour réinitialiser tous les filtres
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
    
    // Vérifier si la salle a des disponibilités
    if (!hall.availability || hall.availability.length === 0) return false;
    
    // Trouver le jour dans les disponibilités
    const day = hall.availability.find(d => d.date === date);
    if (!day) return false;
    
    // Si l'heure est spécifiée, vérifier ce créneau
    if (time) {
      const slot = day.slots.find(s => s.time === time);
      return slot ? slot.available : false;
    }
    
    // Sinon, vérifier s'il y a au moins un créneau disponible ce jour
    return day.slots.some(s => s.available);
  };

  // Filtrer les salles
  const filteredHalls = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    return halls.filter((hall) => {
      // Filtre par nom/ville/quartier
      const matchesQuery = !q || 
        hall.name.toLowerCase().includes(q) ||
        hall.city.toLowerCase().includes(q) ||
        hall.district.toLowerCase().includes(q);

      // Filtre par qualité
      const matchesQuality = !quality || hall.pitchQuality === quality;

      // Filtre par prix
      const matchesPrice = (!minPrice || hall.pricePerHour >= minPrice) &&
                          (!maxPrice || hall.pricePerHour <= maxPrice);

      // Filtre par disponibilité (date/heure)
      const matchesAvailability = isHallAvailable(hall, selectedDate, selectedTime);

      return matchesQuery && matchesQuality && matchesPrice && matchesAvailability;
    });
  }, [halls, query, quality, selectedDate, selectedTime, minPrice, maxPrice]);

  // Compter le nombre total de créneaux disponibles
  const totalAvailableSlots = useMemo(() => {
    let count = 0;
    filteredHalls.forEach(hall => {
      if (hall.availability) {
        hall.availability.forEach(day => {
          count += day.slots.filter(s => s.available).length;
        });
      }
    });
    return count;
  }, [filteredHalls]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <section className="mb-10">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-pitch/70">
          Coup d'envoi
        </p>
        <h1 className="mb-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Trouve et réserve ton terrain
        </h1>
        {!bannersLoading && <BannerCarousel banners={banners} />}
      </section>

      <section>
        <div className="mb-6">
          {/* En-tête avec résultats */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Salles disponibles
                <span className="ml-2 text-base font-normal text-ink/50">
                  ({filteredHalls.length} résultat{filteredHalls.length > 1 ? 's' : ''})
                </span>
              </h2>
              {selectedDate && (
                <p className="text-sm text-ink/50 mt-1">
                  {selectedTime ? `Disponibles le ${new Date(selectedDate).toLocaleDateString('fr-FR')} à ${selectedTime}` : `Disponibles le ${new Date(selectedDate).toLocaleDateString('fr-FR')}`}
                  {totalAvailableSlots > 0 && ` · ${totalAvailableSlots} créneaux disponibles`}
                </p>
              )}
            </div>
          </div>
          
          {/* Filtres avancés */}
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

        {hallsLoading ? (
          <LoadingState label="Chargement des salles…" />
        ) : filteredHalls.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-display text-xl text-ink/60">Aucune salle trouvée</p>
            <p className="mt-2 text-sm text-ink/40 max-w-md mx-auto">
              {selectedDate || selectedTime || minPrice || maxPrice 
                ? "Aucune salle ne correspond à vos critères de recherche"
                : "Essayez de modifier vos filtres ou de réinitialiser la recherche"}
            </p>
            {(selectedDate || selectedTime || minPrice || maxPrice || query || quality) && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-turf px-6 py-2.5 text-sm font-medium text-white hover:bg-turf-dark transition"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <HallList halls={filteredHalls} />
        )}
      </section>
    </div>
  );
}