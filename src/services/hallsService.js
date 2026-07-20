// src/services/hallsService.js
import { db, isFirebaseConfigured } from '../firebase/config';
import { ref, get, onValue } from 'firebase/database';
import { mockHalls } from '../data/mockHalls';

// 🔄 Transformation des données Firebase vers le format Hall
// src/services/hallsService.js
// ... (gardez vos imports)

// 🔄 Transformation des données Firebase vers le format Hall
const transformSalleToHall = (id, data, language = 'fr') => {
  console.log(`🔄 Transformation de la salle ${id} en ${language}:`, data);
  
  const amenities = [];
  if (data.vestiaires) amenities.push(language === 'ar' ? 'غرف تبديل الملابس' : 'Vestiaires');
  if (data.douches) amenities.push(language === 'ar' ? 'دش' : 'Douches');
  if (data.parking) amenities.push(language === 'ar' ? 'موقف سيارات' : 'Parking');
  if (data.eclairage) amenities.push(language === 'ar' ? 'إضاءة LED' : 'Éclairage LED');
  if (data.buvette) amenities.push(language === 'ar' ? 'مقهى' : 'Buvette');

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

  // ✅ Sélectionner la bonne traduction selon la langue
  const name = language === 'ar' ? (data.nom_ar || data.nom) : data.nom;
  const description = language === 'ar' ? (data.description_ar || data.description) : data.description;
  
  // ✅ Gestion de l'état avec traduction
  let quality = data.etat || 'bon';
  if (language === 'ar') {
    // Si etat_ar existe, l'utiliser, sinon traduire automatiquement
    if (data.etat_ar) {
      quality = data.etat_ar;
    } else {
      // Traduction automatique
      const qualityMap = {
        'excellent': 'ممتاز',
        'bon': 'جيد',
        'moyen': 'متوسط'
      };
      quality = qualityMap[data.etat] || data.etat;
    }
  } else {
    // Traduction en français
    const qualityMap = {
      'excellent': 'Excellent',
      'bon': 'Bon',
      'moyen': 'Moyen'
    };
    quality = qualityMap[data.etat] || data.etat;
  }

  // ✅ Gestion de la capacité (nombre de personnes)
  const capacity = data.capacite || data.capacity || 10;

  return {
    id: id,
    name: name || 'Salle sans nom',
    city: data.ville || data.city || (language === 'ar' ? 'نواكشوط' : 'Nouakchott'),
    district: data.quartier || data.district || (language === 'ar' ? 'المركز' : 'Centre'),
    rating: data.rating || 0,
    reviewsCount: data.reviewsCount || 0,
    pitchQuality: quality,
    capacity: capacity,
    pricePerHour: data.prix || data.pricePerHour || data.prixParHeure || 50,
    currency: language === 'ar' ? 'أوقية' : 'MRU',
    photos: photos,
    description: description || '',
    phone: phone,
    location: {
      lat: data.localisation?.latitude || data.location?.lat || 18.0735,
      lng: data.localisation?.longitude || data.location?.lng || -15.9582
    },
    amenities: amenities,
    availability: [],
    // Données brutes pour debug
    _raw: data
  };
};


// 📡 Récupérer TOUTES les salles
export async function getHalls(language = 'fr') {
  console.log(`📡 getHalls - isFirebaseConfigured: ${isFirebaseConfigured}, langue: ${language}`);
  
  if (!isFirebaseConfigured) {
    console.log('📦 Utilisation des mockHalls');
    await new Promise((r) => setTimeout(r, 250));
    return mockHalls;
  }

  try {
    const sallesRef = ref(db, 'salles');
    const snapshot = await get(sallesRef);
    
    console.log('📦 Snapshot existe?', snapshot.exists());
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('📦 Clés trouvées:', Object.keys(data));
      
      const halls = Object.entries(data).map(([id, salle]) => {
        console.log(`🔄 Traitement de la salle: ${id}`);
        return transformSalleToHall(id, salle, language);
      });
      
      console.log(`✅ ${halls.length} salles chargées depuis Firebase (${language})`);
      console.log('📋 Salles:', halls.map(h => ({ id: h.id, name: h.name })));
      
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
export async function getHallById(id, language = 'fr') {
  console.log(`📡 getHallById(${id}) - langue: ${language}`);
  
  if (!isFirebaseConfigured) {
    await new Promise((r) => setTimeout(r, 150));
    return mockHalls.find((h) => h.id === id) ?? null;
  }

  try {
    const salleRef = ref(db, `salles/${id}`);
    const snapshot = await get(salleRef);
    
    console.log(`📦 Salle ${id} existe?`, snapshot.exists());
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`📦 Données de la salle ${id}:`, data);
      
      const hall = transformSalleToHall(id, data, language);
      
      // Récupérer les réservations pour cette salle
      try {
        const reservations = await getReservationsForSalle(id);
        hall.availability = transformAvailability(reservations);
        console.log(`✅ Réservations chargées pour ${id}`);
      } catch (resError) {
        console.warn(`⚠️ Impossible de charger les réservations:`, resError.message);
        hall.availability = [];
      }
      
      console.log(`✅ Salle ${id} chargée avec succès (${language})`);
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
export async function getReservationsForSalle(salleId) {
  try {
    const reservationsRef = ref(db, `reservations/${salleId}`);
    const snapshot = await get(reservationsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error('❌ Erreur réservations:', error);
    return {};
  }
}

// 🔄 Transformer les réservations en disponibilités
export function transformAvailability(reservations) {
  const availability = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayAvailability = {
      date: dateStr,
      day: getDayName(date.getDay()),
      slots: []
    };
    
    for (let hour = 9; hour <= 23; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const isReserved = reservations[dateStr] && reservations[dateStr][timeStr];
      
      dayAvailability.slots.push({
        time: timeStr,
        available: !isReserved
      });
    }
    
    availability.push(dayAvailability);
  }
  
  return availability;
}

function getDayName(dayIndex) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[dayIndex];
}

// 🔄 Écoute en temps réel (optionnel)
export function subscribeToHalls(callback, language = 'fr') {
  if (!isFirebaseConfigured) {
    callback(mockHalls);
    return () => {};
  }

  const sallesRef = ref(db, 'salles');
  const unsubscribe = onValue(sallesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const halls = Object.entries(data).map(([id, salle]) => 
        transformSalleToHall(id, salle, language)
      );
      callback(halls);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}