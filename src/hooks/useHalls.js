// src/hooks/useHalls.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getHalls, getHallById, subscribeToHalls, getReservationsForSalle, transformAvailability } from '../services/hallsService';

export const useHalls = () => {
  const { i18n } = useTranslation();
  const language = i18n.language || 'fr';
  
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`🔄 useHalls: Chargement en ${language}...`);
    
    const loadHalls = async () => {
      try {
        const data = await getHalls(language);
        
        // Charger les disponibilités pour chaque salle
        const hallsWithAvailability = await Promise.all(
          data.map(async (hall) => {
            try {
              const reservations = await getReservationsForSalle(hall.id);
              hall.availability = transformAvailability(reservations);
            } catch (err) {
              console.warn(`⚠️ Pas de disponibilités pour ${hall.id}`);
              hall.availability = [];
            }
            return hall;
          })
        );
        
        setHalls(hallsWithAvailability);
        setError(null);
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadHalls();
  }, [language]);

  return { halls, loading, error };
};

export const useHall = (id) => {
  const { i18n } = useTranslation();
  const language = i18n.language || 'fr';
  
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    console.log(`🔄 useHall: Chargement ${id} en ${language}...`);

    const loadHall = async () => {
      try {
        const data = await getHallById(id, language);
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
  }, [id, language]);

  return { hall, loading, error };
};