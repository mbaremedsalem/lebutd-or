// src/pages/HomePage.jsx
// 👉 Gardez EXACTEMENT votre code actuel
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
  const [query, setQuery] = useState('');
  const [quality, setQuality] = useState('');

  const filteredHalls = useMemo(() => {
    const q = query.trim().toLowerCase();
    return halls.filter((hall) => {
      const matchesQuery =
        !q ||
        hall.name.toLowerCase().includes(q) ||
        hall.city.toLowerCase().includes(q) ||
        hall.district.toLowerCase().includes(q);
      const matchesQuality = !quality || hall.pitchQuality === quality;
      return matchesQuery && matchesQuality;
    });
  }, [halls, query, quality]);

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
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Salles disponibles</h2>
          <SearchFilters
            query={query}
            onQueryChange={setQuery}
            quality={quality}
            onQualityChange={setQuality}
          />
        </div>

        {hallsLoading ? (
          <LoadingState label="Chargement des salles…" />
        ) : (
          <HallList halls={filteredHalls} />
        )}
      </section>
    </div>
  );
}