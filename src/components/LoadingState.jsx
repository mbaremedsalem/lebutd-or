export default function LoadingState({ label = 'Chargement…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink/50">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-line border-t-pitch" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
