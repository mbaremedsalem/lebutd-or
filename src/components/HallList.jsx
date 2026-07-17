import HallCard from './HallCard';

export default function HallList({ halls }) {
  if (halls.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center text-ink/60">
        <p className="font-display text-lg">Aucune salle ne correspond à ta recherche</p>
        <p className="mt-1 text-sm">Essaie une autre ville ou un autre quartier.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {halls.map((hall) => (
        <HallCard key={hall.id} hall={hall} />
      ))}
    </div>
  );
}
