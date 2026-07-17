import { useState } from 'react';

export default function PhotoGallery({ photos, hallName }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="h-72 w-full overflow-hidden rounded-2xl sm:h-96">
        <img
          src={photos[active]}
          alt={`${hallName} — photo ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo}
              onClick={() => setActive(i)}
              aria-label={`Voir la photo ${i + 1}`}
              className={`focus-ring h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? 'border-pitch' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
