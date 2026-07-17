import { Gift, Ticket, Sparkles, Megaphone } from 'lucide-react';

const TYPE_META = {
  tirage: { label: 'Tirage au sort', icon: Ticket, color: 'bg-floodlight text-ink' },
  cadeau: { label: 'Cadeau', icon: Gift, color: 'bg-turf text-chalk' },
  offre: { label: 'Offre', icon: Sparkles, color: 'bg-pitch-light text-chalk' },
  autre: { label: 'Annonce', icon: Megaphone, color: 'bg-ink text-chalk' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function BannerCard({ banner }) {
  const meta = TYPE_META[banner.type] ?? TYPE_META.autre;
  const Icon = meta.icon;

  return (
    <article className="relative h-full w-full overflow-hidden rounded-2xl bg-ink text-chalk">
      <img
        src={banner.photo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end gap-2 p-6">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${meta.color}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
        <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {banner.title}
        </h3>
        <p className="max-w-xl text-sm text-chalk/85 sm:text-base">{banner.content}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-chalk/60">
          Valable du {formatDate(banner.startDate)} au {formatDate(banner.endDate)}
        </p>
      </div>
    </article>
  );
}
