// src/services/hallsService.js
import { db, isFirebaseConfigured } from '../firebase/config';
import { ref, get, onValue } from 'firebase/database';
import { mockHalls } from '../data/mockHalls';

// 🔄 Transformation des données Firebase vers le format Hall
const transformSalleToHall = (id, data) => {
  console.log(`🔄 Transformation de la salle ${id}:`, data);
  
  const amenities = [];
  if (data.vestiaires) amenities.push('Vestiaires');
  if (data.douches) amenities.push('Douches');
  if (data.parking) amenities.push('Parking');
  if (data.eclairage) amenities.push('Éclairage LED');
  if (data.buvette) amenities.push('Buvette');

  let photos = [];
  if (data.images) {
    if (Array.isArray(data.images)) {
      photos = data.images;
    } else if (typeof data.images === 'object') {
      photos = Object.values(data.images);
    }
  }

  let phone = data.telephone || data.phone || '+222 00 00 00 00';
  phone = String(phone);

  return {
    id: id,
    name: data.nom || 'Salle sans nom',
    city: data.ville || data.city || 'Nouakchott',
    district: data.quartier || data.district || 'Centre',
    rating: data.rating || 0,
    reviewsCount: data.reviewsCount || 0,
    pitchQuality: data.etat || 'bon',
    capacity: data.capacite || data.capacity || 10,
    pricePerHour: data.prix || data.pricePerHour || data.prixParHeure || 50,
    currency: 'DH',
    photos: photos,
    description: data.description || '',
    phone: phone,
    location: {
      lat: data.localisation?.latitude || data.location?.lat || 18.0735,
      lng: data.localisation?.longitude || data.location?.lng || -15.9582
    },
    amenities: amenities,
    availability: []
  };
};

// 📡 Récupérer TOUTES les salles
export async function getHalls() {
  console.log('📡 getHalls - isFirebaseConfigured:', isFirebaseConfigured);
  
  if (!isFirebaseConfigured) {
    console.log('📦 Utilisation des mockHalls');
    await new Promise((r) => setTimeout(r, 250));
    return mockHalls;
  }

  try {
    const sallesRef = ref(db, 'salles');
    const snapshot = await get(sallesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const halls = Object.entries(data).map(([id, salle]) => 
        transformSalleToHall(id, salle)
      );
      console.log(`✅ ${halls.length} salles chargées depuis Firebase`);
      return halls;
    } else {
      console.log('⚠️ Aucune salle trouvée dans Firebase');
      return [];
    }
  } catch (error) {
    console.error('❌ Erreur Firebase:', error);
    return mockHalls;
  }
}

// 📡 Récupérer UNE salle par ID
export async function getHallById(id) {
  console.log(`📡 getHallById(${id})`);
  
  if (!isFirebaseConfigured) {
    await new Promise((r) => setTimeout(r, 150));
    return mockHalls.find((h) => h.id === id) ?? null;
  }

  try {
    const salleRef = ref(db, `salles/${id}`);
    const snapshot = await get(salleRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const hall = transformSalleToHall(id, data);
      
      // ✅ Récupérer les réservations pour cette salle
      try {
        const reservations = await getReservationsForSalle(id);
        hall.availability = transformAvailability(reservations);
        console.log(`✅ Réservations chargées pour ${id}`);
      } catch (resError) {
        console.warn(`⚠️ Impossible de charger les réservations:`, resError.message);
        hall.availability = [];
      }
      
      console.log(`✅ Salle ${id} chargée avec succès`);
      return hall;
    } else {
      console.log(`⚠️ Salle ${id} non trouvée`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur chargement salle ${id}:`, error);
    return mockHalls.find((h) => h.id === id) ?? null;
  }
}

// 📡 Récupérer les réservations d'une salle
async function getReservationsForSalle(salleId) {
  try {
    // 🔥 CHANGEMENT ICI: La structure est reservations/salleId/
    const reservationsRef = ref(db, `reservations/${salleId}`);
    const snapshot = await get(reservationsRef);
    
    console.log(`📦 Réservations pour ${salleId} existe?`, snapshot.exists());
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`📦 Réservations trouvées:`, data);
      return data;
    } else {
      console.log(`⚠️ Aucune réservation pour ${salleId}`);
      return {};
    }
  } catch (error) {
    console.error('❌ Erreur réservations:', error);
    throw error;
  }
}

// 🔄 Transformer les réservations en disponibilités
function transformAvailability(reservations) {
  console.log('🔄 Transformation des réservations en disponibilités:', reservations);
  
  const availability = [];
  const today = new Date();
  
  // Générer les 7 prochains jours
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayAvailability = {
      date: dateStr,
      day: getDayName(date.getDay()),
      slots: []
    };
    
    // Créneaux de 09:00 à 23:00
    for (let hour = 9; hour <= 23; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Vérifier si ce créneau est réservé
      const isReserved = reservations[dateStr] && reservations[dateStr][timeStr];
      
      dayAvailability.slots.push({
        time: timeStr,
        available: !isReserved
      });
    }
    
    availability.push(dayAvailability);
  }
  
  console.log('✅ Disponibilités générées:', availability);
  return availability;
}

function getDayName(dayIndex) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[dayIndex];
}

// 🔄 Écoute en temps réel (optionnel)
export function subscribeToHalls(callback) {
  if (!isFirebaseConfigured) {
    callback(mockHalls);
    return () => {};
  }

  const sallesRef = ref(db, 'salles');
  const unsubscribe = onValue(sallesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const halls = Object.entries(data).map(([id, salle]) => 
        transformSalleToHall(id, salle)
      );
      callback(halls);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}