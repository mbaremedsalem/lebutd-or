const QUALITY_META = {
  excellent: { label: 'Excellent état', color: 'bg-turf/15 text-pitch-dark border-turf/40' },
  bon: { label: 'Bon état', color: 'bg-turf/10 text-pitch-light border-turf/25' },
  moyen: { label: 'État moyen', color: 'bg-floodlight/20 text-ink border-floodlight/50' },
  a_renover: { label: 'À rénover', color: 'bg-red-100 text-red-800 border-red-300' },
};

export default function QualityBadge({ quality }) {
  const meta = QUALITY_META[quality] ?? QUALITY_META.moyen;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}
