// src/services/bannersService.js
import { db, isFirebaseConfigured } from '../firebase/config';
import { ref, get } from 'firebase/database';
import { mockBanners } from '../data/mockBanners';

export async function getActiveBanners() {
  console.log('📡 getActiveBanners - isFirebaseConfigured:', isFirebaseConfigured);
  
  let banners = [];

  if (isFirebaseConfigured) {
    try {
      const bannersRef = ref(db, 'banners');
      const snapshot = await get(bannersRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        banners = Object.entries(data).map(([id, banner]) => ({
          id,
          ...banner
        }));
        console.log(`✅ ${banners.length} bannières chargées`);
      } else {
        console.log('⚠️ Aucune bannière trouvée');
        banners = mockBanners;
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      banners = mockBanners;
    }
  } else {
    await new Promise((r) => setTimeout(r, 200));
    banners = mockBanners;
  }

  // Filtrer les bannières actives
  const today = new Date().toISOString().slice(0, 10);
  const activeBanners = banners.filter((b) => {
    if (!b.startDate && !b.endDate) return true;
    return (!b.startDate || b.startDate <= today) && (!b.endDate || today <= b.endDate);
  });
  
  return activeBanners;
}