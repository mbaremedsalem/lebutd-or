// src/hooks/useBanners.js
import { useState, useEffect } from 'react';
import { getActiveBanners } from '../services/bannersService';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useBanners: Chargement...');
    
    const loadBanners = async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error('❌ Erreur:', error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  return { banners, loading };
};