// src/components/HallList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Clock, Calendar, Check } from 'lucide-react';
import QualityBadge from './QualityBadge';

const HallList = ({ halls }) => {
  // Fonction pour trouver le prochain créneau disponible
  const getNextAvailability = (hall) => {
    if (!hall.availability || hall.availability.length === 0) {
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    
    for (const day of hall.availability) {
      if (day.date >= today) {
        const availableSlots = day.slots.filter(s => s.available);
        if (availableSlots.length > 0) {
          return {
            date: day.date,
            day: day.day,
            slots: availableSlots.slice(0, 3) // Afficher les 3 premiers
          };
        }
      }
    }
    return null;
  };

  if (halls.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-chalk py-16 text-center">
        <p className="font-display text-lg text-ink/60">
          Aucune salle trouvée
        </p>
        <p className="text-sm text-ink/40">Essayez de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {halls.map((hall) => {
        const nextAvail = getNextAvailability(hall);
        
        return (
          <Link
            key={hall.id}
            to={`/salles/${hall.id}`}  // ← Changé de /hall/ à /salles/
            className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg"
          >
            {/* Image */}
            <div className="aspect-[16/9] overflow-hidden bg-soft relative">
              {hall.photos && hall.photos.length > 0 ? (
                <img
                  src={hall.photos[0]}
                  alt={hall.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-pitch/10 to-turf/10">
                  <span className="text-4xl">⚽</span>
                </div>
              )}
              
              {/* Badge qualité */}
              <div className="absolute top-3 left-3">
                <QualityBadge quality={hall.pitchQuality} />
              </div>
              

              <div className="absolute bottom-3 right-3 rounded-xl bg-black/70 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-white">
                {hall.pricePerHour} <span className="text-xs font-normal">MRU</span>
              </div>

              {/* Badge disponibilité */}
              {nextAvail && (
                <div className="absolute bottom-3 left-3 rounded-xl bg-green-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1.5">
                  <Check className="h-3 w-3" />
                  Disponible
                </div>
              )}
            </div>
            
            {/* Informations */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-ink truncate group-hover:text-turf transition">
                    {hall.name}
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-ink/60 truncate">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    {hall.district}, {hall.city}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-ink flex-shrink-0 ml-2">
                  <Star className="h-4 w-4 fill-floodlight text-floodlight" />
                  {hall.rating}
                </div>
              </div>

              {/* Équipements */}
              {hall.amenities && hall.amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {hall.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-soft px-2 py-0.5 text-xs text-ink/60"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hall.amenities.length > 3 && (
                    <span className="text-xs text-ink/40">
                      +{hall.amenities.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Prochain créneau disponible */}
              {nextAvail && (
                <div className="mt-3 pt-3 border-t border-line">
                  <div className="flex items-center gap-2 text-xs text-ink/50">
                    <Calendar className="h-3 w-3" />
                    <span>Prochain créneau :</span>
                    <span className="font-medium text-ink">
                      {nextAvail.day} {new Date(nextAvail.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {nextAvail.slots.map((slot) => (
                      <span
                        key={slot.time}
                        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                      >
                        <Clock className="h-2.5 w-2.5" />
                        {slot.time}
                      </span>
                    ))}
                    {nextAvail.slots.length > 3 && (
                      <span className="text-xs text-ink/40">+{nextAvail.slots.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HallList;