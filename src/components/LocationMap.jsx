// src/components/LocationMap.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, LocateFixed, Navigation, X, Loader2 } from 'lucide-react';

// Icônes personnalisées (le bundler casse les chemins d'icônes par défaut de Leaflet)
const hallIcon = L.divIcon({
  className: '',
  html: `<div style="background:#1B2B22;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35)">
           <span style="transform:rotate(45deg);font-size:16px;line-height:1">⚽</span>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,.25)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Recentre la carte en douceur quand une nouvelle position est choisie
function FlyToOnChange({ target, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, zoom, { duration: 0.8 });
  }, [target, zoom, map]);
  return null;
}

// Distance à vol d'oiseau (formule de Haversine), en km
function distanceKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationMap({ location, hallName }) {
  const { lat, lng } = location;
  const hallPos = useMemo(() => [lat, lng], [lat, lng]);

  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  // Fermer la liste de résultats si on clique en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Recherche d'adresse en direct via Nominatim (OpenStreetMap)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&countrycodes=mr&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelectResult = (place) => {
    const pos = [parseFloat(place.lat), parseFloat(place.lon)];
    setUserPos(pos);
    setFlyTarget(pos);
    setQuery(place.display_name);
    setResults([]);
    setSearchOpen(false);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocError("La géolocalisation n'est pas prise en charge par cet appareil.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        setFlyTarget(p);
        setQuery('');
        setLocating(false);
      },
      () => {
        setLocError('Position indisponible. Vérifiez les autorisations de localisation.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const distance = userPos ? distanceKm(userPos, hallPos) : null;
  const directionsUrl = userPos
    ? `https://www.openstreetmap.org/directions?from=${userPos[0]}%2C${userPos[1]}&to=${lat}%2C${lng}`
    : `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {/* Barre de recherche d'adresse complète, avec autocomplétion */}
      <div ref={boxRef} className="relative border-b border-line bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Rechercher une adresse, un quartier, une ville..."
            className="w-full rounded-xl border border-line bg-soft/40 py-2.5 pl-9 pr-16 text-sm focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/20 transition"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {searching && <Loader2 className="h-4 w-4 animate-spin text-ink/30" />}
            {query && !searching && (
              <button
                onClick={() => { setQuery(''); setResults([]); }}
                className="rounded p-1 text-ink/40 hover:text-ink"
                aria-label="Effacer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {searchOpen && results.length > 0 && (
          <ul className="absolute left-3 right-3 top-full z-[500] mt-1 max-h-64 overflow-y-auto rounded-xl border border-line bg-white shadow-lg">
            {results.map((place) => (
              <li key={place.place_id}>
                <button
                  onClick={() => handleSelectResult(place)}
                  className="block w-full truncate px-3 py-2.5 text-left text-sm text-ink/80 hover:bg-soft/60 transition"
                >
                  {place.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {searchOpen && query.trim().length >= 3 && !searching && results.length === 0 && (
          <p className="absolute left-3 right-3 top-full z-[500] mt-1 rounded-xl border border-line bg-white px-3 py-2.5 text-xs text-ink/40 shadow-lg">
            Aucune adresse trouvée
          </p>
        )}
      </div>

      {/* Vraie carte interactive (OpenStreetMap via Leaflet) */}
      <div className="relative">
        <MapContainer
          center={hallPos}
          zoom={15}
          scrollWheelZoom={false}
          className="h-64 w-full sm:h-80"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={hallPos} icon={hallIcon}>
            <Popup>{hallName}</Popup>
          </Marker>
          {userPos && (
            <Marker position={userPos} icon={userIcon}>
              <Popup>Votre position</Popup>
            </Marker>
          )}
          <FlyToOnChange target={flyTarget} zoom={15} />
        </MapContainer>

        <button
          onClick={locateMe}
          disabled={locating}
          className="focus-ring absolute bottom-3 right-3 z-[400] flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-ink shadow-md hover:bg-soft transition disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
          Me localiser
        </button>
      </div>

      {/* Distance réelle + lien itinéraire */}
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 text-xs text-ink/60">
        <div className="min-w-0">
          <span className="font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
          {distance !== null && (
            <span className="ml-2 font-semibold text-turf-dark">
              · à {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
            </span>
          )}
          {locError && <p className="mt-0.5 text-red-500">{locError}</p>}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex shrink-0 items-center gap-1 rounded font-semibold text-pitch hover:underline"
        >
          Itinéraire <Navigation className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}