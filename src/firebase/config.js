// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA_MuJjDz4wE6tKpL3nXdV5wFvGcHjK9wU",
  authDomain: "lebutdore-dash.firebaseapp.com",
  databaseURL: "https://lebutdore-dash-default-rtdb.firebaseio.com",
  projectId: "lebutdore-dash",
  storageBucket: "lebutdore-dash.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services
export const db = getDatabase(app);
export const storage = getStorage(app);

// ✅ IMPORTANT: Indicateur pour utiliser Firebase ou les mock
export const isFirebaseConfigured = true; // Mettre false pour utiliser les mock