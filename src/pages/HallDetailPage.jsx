// src/pages/HallDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Phone, Star, Users, Check } from 'lucide-react';
import { useHall } from '../hooks/useHalls';
import PhotoGallery from '../components/PhotoGallery';
import QualityBadge from '../components/QualityBadge';
import AvailabilityTable from '../components/AvailabilityTable';
import LocationMap from '../components/LocationMap';
import LoadingState from '../components/LoadingState';

export default function HallDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { hall, loading } = useHall(id);
  
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language || 'fr';

  // Ajout de logs pour déboguer
  console.log('🔍 Hall chargé:', hall);
  console.log('🔍 Capacity:', hall?.capacity);
  console.log('🔍 PitchQuality:', hall?.pitchQuality);

  if (loading) return <LoadingState label={t('detail.loading')} />;

  if (!hall) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p className="font-display text-2xl">{t('detail.notFound')}</p>
        <Link to="/" className="focus-ring mt-4 inline-block rounded text-pitch hover:underline">
          ← {t('detail.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <Link
        to="/"
        className={`focus-ring mb-5 inline-flex items-center gap-1.5 rounded text-sm font-medium text-ink/60 hover:text-pitch ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} /> 
        {t('detail.backToList')}
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PhotoGallery photos={hall.photos} hallName={hall.name} />

          <div className="mt-6">
            <div className={`flex flex-wrap items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className="font-display text-3xl font-semibold text-ink">{hall.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-ink/60">
                  <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {hall.district}, {hall.city}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-lg font-semibold text-ink ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="h-5 w-5 fill-floodlight text-floodlight" />
                {hall.rating}
                <span className="text-sm font-normal text-ink/50">
                  ({hall.reviewsCount} {t('detail.reviews')})
                </span>
              </div>
            </div>

            <div className={`mt-4 flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* ✅ Qualité traduite directement */}
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                hall.pitchQuality === 'ممتاز' || hall.pitchQuality === 'Excellent' 
                  ? 'bg-green-100 text-green-700' 
                  : hall.pitchQuality === 'جيد' || hall.pitchQuality === 'Bon'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {hall.pitchQuality}
              </span>
              
              {/* ✅ Capacité */}
              <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                <Users className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {isRTL ? `لـ ${hall.capacity} أشخاص` : `À ${hall.capacity} personnes`}
              </span>
              
              {/* ✅ Équipements */}
              {hall.amenities.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink/70"
                >
                  <Check className="h-3 w-3 text-turf" />
                  {a}
                </span>
              ))}
            </div>

            <p className={`mt-4 leading-relaxed text-ink/75 ${isRTL ? 'text-right' : ''}`}>
              {hall.description}
            </p>

            <a
              href={`tel:${hall.phone.replace(/\s/g, '')}`}
              className={`focus-ring mt-4 inline-flex items-center gap-2 rounded-xl bg-pitch px-4 py-2.5 text-sm font-semibold text-chalk transition hover:bg-pitch-dark ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Phone className="h-4 w-4" /> 
              {t('detail.call')}
            </a>
          </div>

          <div className="mt-8">
            <h2 className={`mb-3 font-display text-xl font-semibold text-ink ${isRTL ? 'text-right' : ''}`}>
              {t('detail.locationLabel')}
            </h2>
            <LocationMap location={hall.location} hallName={hall.name} />
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="ticket-notch sticky top-24 rounded-2xl bg-ink p-5 text-chalk">
            <p className="font-mono text-xs uppercase tracking-widest text-chalk/60 text-center">
              {t('detail.priceLabel')}
            </p>
            <p className="font-display text-4xl font-semibold text-floodlight text-center">
              {hall.pricePerHour.toLocaleString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR')}
              <span className="ml-1 text-base text-chalk/70">
                {hall.currency} {t('detail.perHour')}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className={`mb-3 font-display text-lg font-semibold text-ink ${isRTL ? 'text-right' : ''}`}>
              {t('detail.availabilityLabel')}
            </h2>
            <AvailabilityTable availability={hall.availability} />
          </div>
        </aside>
      </div>
    </div>
  );
}