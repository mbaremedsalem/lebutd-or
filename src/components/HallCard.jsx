import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import QualityBadge from './QualityBadge';

export default function HallCard({ hall }) {
  return (
    <Link
      to={`/salles/${hall.id}`}
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={hall.photos[0]}
          alt={`Terrain de ${hall.name}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Billet de prix, façon souche de ticket de stade */}
        <div className="ticket-notch absolute right-3 top-3 bg-ink px-3 py-1.5 text-right text-chalk shadow-md">
          <p className="font-mono text-[10px] uppercase tracking-widest text-chalk/60">1h</p>
          <p className="font-display text-lg font-semibold leading-none text-floodlight">
            {hall.pricePerHour.toLocaleString('fr-FR')}
            <span className="ml-1 text-xs text-chalk/70">{hall.currency}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {hall.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
            <Star className="h-4 w-4 fill-floodlight text-floodlight" />
            {hall.rating}
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-ink/60">
          <MapPin className="h-4 w-4 shrink-0" />
          {hall.district}, {hall.city}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <QualityBadge quality={hall.pitchQuality} />
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-ink/70">
            <Users className="h-3.5 w-3.5" />À {hall.capacity}
          </span>
        </div>
      </div>
    </Link>
  );
}
