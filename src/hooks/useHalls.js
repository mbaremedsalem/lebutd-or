// src/hooks/useHalls.js
import { useState, useEffect } from 'react';
import { getHalls, getHallById, subscribeToHalls, getReservationsForSalle, transformAvailability } from '../services/hallsService';

export const useHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 useHalls: Chargement...');
    
    const loadHalls = async () => {
      try {
        const data = await getHalls();
        console.log('📦 useHalls - Données reçues:', data);
        
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
  }, []);

  return { halls, loading, error };
};

export const useHall = (id) => {
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.log('⚠️ useHall - Pas d\'ID fourni');
      setLoading(false);
      return;
    }

    console.log(`🔄 useHall: Chargement de la salle ${id}...`);

    const loadHall = async () => {
      try {
        const data = await getHallById(id);
        console.log(`📦 useHall - Données reçues pour ${id}:`, data);
        
        if (data) {
          setHall(data);
        } else {
          console.log(`⚠️ useHall - Aucune donnée pour ${id}`);
          setHall(null);
        }
        setError(null);
      } catch (err) {
        console.error(`❌ Erreur chargement salle ${id}:`, err);
        setError(err);
        setHall(null);
      } finally {
        setLoading(false);
      }
    };

    loadHall();
  }, [id]);

  return { hall, loading, error };
};