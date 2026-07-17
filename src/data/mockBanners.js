/**
 * ⚠️ Forme identique au typedef `Banner` (src/types/index.js) et à la
 * collection Firestore `banners`. À remplacer par src/services/bannersService.js
 * une fois Firebase branché.
 */

export const mockBanners = [
  {
    id: 'banner-001',
    title: 'Tirage au sort : 1h offerte',
    content:
      "Réserve n'importe quelle salle cette semaine et participe automatiquement au tirage au sort d'une heure de terrain gratuite.",
    photo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&q=80',
    startDate: '2026-07-10',
    endDate: '2026-07-31',
    type: 'tirage',
  },
  {
    id: 'banner-002',
    title: 'Ballon officiel offert',
    content:
      "Pour toute réservation de 3 séances au Stade Al Waha, reçois un ballon officiel de la saison.",
    photo: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1600&q=80',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    type: 'cadeau',
    linkedHallId: 'hall-001',
  },
  {
    id: 'banner-003',
    title: '-20% en semaine',
    content:
      'Toutes les réservations du lundi au jeudi avant 17h bénéficient de 20% de réduction sur le prix de la salle.',
    photo: 'https://images.unsplash.com/photo-1470259078422-6a9d9c31ff09?w=1600&q=80',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    type: 'offre',
  },
];
