import { ExternalLink } from 'lucide-react';

export default function LocationMap({ location, hallName }) {
  const { lat, lng } = location;
  const delta = 0.01;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const externalUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <iframe
        title={`Localisation de ${hallName}`}
        src={embedUrl}
        className="h-64 w-full sm:h-72"
        loading="lazy"
      />
      <div className="flex items-center justify-between bg-white px-4 py-2.5 text-xs text-ink/60">
        <span className="font-mono">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </span>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1 rounded font-semibold text-pitch hover:underline"
        >
          Itinéraire <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
