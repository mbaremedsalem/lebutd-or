// src/hooks/useHalls.js
import { useState, useEffect } from 'react';
import { getHalls, getHallById, subscribeToHalls } from '../services/hallsService';

export const useHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 useHalls: Chargement...');
    
    const loadHalls = async () => {
      try {
        const data = await getHalls();
        setHalls(data);
        setError(null);
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadHalls();

    // Écoute en temps réel (optionnel)
    const unsubscribe = subscribeToHalls((data) => {
      setHalls(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { halls, loading, error };
};

export const useHall = (id) => {
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    console.log(`🔄 useHall: Chargement ${id}...`);

    const loadHall = async () => {
      try {
        const data = await getHallById(id);
        setHall(data);
        setError(null);
      } catch (err) {
        console.error(`❌ Erreur:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadHall();
  }, [id]);

  return { hall, loading, error };
};