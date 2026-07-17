import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BannerCard from './BannerCard';

export default function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const goTo = (i) => setIndex((i + banners.length) % banners.length);

  return (
    <section id="offres" aria-label="Offres et promotions" className="relative">
      <div className="h-64 w-full sm:h-80">
        <BannerCard banner={banners[index]} />
      </div>

      {banners.length > 1 && (
        <>
          <button
            aria-label="Offre précédente"
            onClick={() => goTo(index - 1)}
            className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-chalk/90 p-2 text-ink shadow-md transition hover:bg-chalk"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Offre suivante"
            onClick={() => goTo(index + 1)}
            className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-chalk/90 p-2 text-ink shadow-md transition hover:bg-chalk"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="mt-3 flex justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                aria-label={`Aller à l'offre ${i + 1}`}
                onClick={() => goTo(i)}
                className={`focus-ring h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-pitch' : 'w-2 bg-pitch/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
