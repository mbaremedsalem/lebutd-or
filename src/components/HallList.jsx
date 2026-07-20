// src/components/HallList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Clock, Calendar, Check } from 'lucide-react';
import QualityBadge from './QualityBadge';

const HallList = ({ halls }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language || 'fr';

  const getNextAvailability = (hall) => {
    if (!hall.availability || hall.availability.length === 0) return null;

    const today = new Date().toISOString().split('T')[0];

    for (const day of hall.availability) {
      if (day.date >= today) {
        const availableSlots = day.slots.filter((s) => s.available);
        if (availableSlots.length > 0) {
          return { date: day.date, day: day.day, slots: availableSlots.slice(0, 3) };
        }
      }
    }
    return null;
  };

  const getDisplayQuality = (hall) => {
    if (currentLang === 'ar') {
      if (hall._raw && hall._raw.etat_ar) return hall._raw.etat_ar;
      const qualityMap = { excellent: 'ممتاز', bon: 'جيد', moyen: 'متوسط' };
      return qualityMap[hall.pitchQuality] || hall.pitchQuality;
    }

    if (hall._raw && hall._raw.etat) {
      const qualityMap = { excellent: 'Excellent', bon: 'Bon', moyen: 'Moyen' };
      return qualityMap[hall._raw.etat] || hall._raw.etat;
    }

    const qualityMap = {
      excellent: currentLang === 'ar' ? 'ممتاز' : 'Excellent',
      bon: currentLang === 'ar' ? 'جيد' : 'Bon',
      moyen: currentLang === 'ar' ? 'متوسط' : 'Moyen'
    };
    return qualityMap[hall.pitchQuality] || hall.pitchQuality;
  };

  if (halls.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-chalk py-16 text-center">
        <p className="font-display text-lg text-ink/60">{t('home.noHallsFound')}</p>
        <p className="text-sm text-ink/40">{t('home.tryModifyFilters')}</p>
      </div>
    );
  }

  const locale = currentLang === 'ar' ? 'ar-MA' : 'fr-FR';

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${isRTL ? 'rtl' : ''}`}>
      {halls.map((hall) => {
        const nextAvail = getNextAvailability(hall);
        const displayQuality = getDisplayQuality(hall);

        return (
          <Link
            key={hall.id}
            to={`/salles/${hall.id}`}
            className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white transition active:scale-[0.98] hover:shadow-lg"
          >
            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden bg-soft relative">
              {hall.photos && hall.photos.length > 0 ? (
                <img
                  src={hall.photos[0]}
                  alt={hall.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-pitch/10 to-turf/10">
                  <span className="text-4xl">⚽</span>
                </div>
              )}

              <div className="absolute top-3 left-3">
                <QualityBadge quality={displayQuality} />
              </div>

              <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} rounded-xl bg-black/70 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-white`}>
                {hall.pricePerHour} <span className="text-xs font-normal">{t('detail.currency')}</span>
              </div>

              {nextAvail && (
                <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} rounded-xl bg-green-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1.5`}>
                  <Check className="h-3 w-3" />
                  {t('hallList.available')}
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="p-3.5 sm:p-4">
              <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-ink truncate group-hover:text-turf transition">
                    {hall.name}
                  </h3>
                  <p className={`flex items-center gap-1 text-xs sm:text-sm text-ink/60 truncate ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    {hall.district}, {hall.city}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold text-ink flex-shrink-0 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  <Star className="h-4 w-4 fill-floodlight text-floodlight" />
                  {hall.rating}
                </div>
              </div>

              {/* Prochain créneau disponible : l'info qu'on cherche en priorité */}
              {nextAvail ? (
                <div className={`mt-3 pt-3 border-t border-line ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-1.5 text-xs text-ink/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium text-ink">
                      {nextAvail.day} {new Date(nextAvail.date).toLocaleDateString(locale)}
                    </span>
                  </div>
                  <div className={`flex flex-wrap gap-1.5 mt-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              ) : (
                hall.amenities && hall.amenities.length > 0 && (
                  <div className={`mt-3 pt-3 border-t border-line flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {hall.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="rounded-full bg-soft px-2 py-0.5 text-xs text-ink/60">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HallList;