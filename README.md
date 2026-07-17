# le But d'or — Réservation de salles de foot

Application React (Vite) qui liste des salles/terrains de football avec leur
localisation, leurs créneaux disponibles, l'état de leur terrain et une
section bannières pour les offres, tirages et cadeaux.

## Démarrer le projet

```bash
npm install
npm run dev
```

L'app démarre sur `http://localhost:5173`. **Aucune configuration Firebase
n'est nécessaire pour la faire tourner** : tant qu'il n'y a pas de `.env`,
elle affiche les données statiques de `src/data/mockHalls.js` et
`src/data/mockBanners.js`.

## Architecture

```
src/
  types/              Contrat de données (JSDoc) — la forme exacte des
                       documents Firestore, respectée par les mocks ET
                       par les vrais appels Firebase.
  data/                Données statiques de démarrage (même forme que Firestore).
  services/            Seule couche autorisée à parler à Firebase ou aux mocks.
    firebaseConfig.js   Initialise Firebase SI les variables d'env sont présentes.
    hallsService.js     getHalls(), getHallById(id)
    bannersService.js   getActiveBanners() — filtre déjà les dates expirées.
  hooks/                useHalls(), useHall(id), useBanners() : gèrent
                        loading/error, découplent les composants des services.
  components/           Composants UI purs, ne connaissent pas Firebase.
  pages/                HomePage (liste + bannières), HallDetailPage.
```

Aucun composant n'importe jamais Firebase ni les fichiers `data/*`
directement : tout passe par `services/` puis `hooks/`. C'est ce qui permet
de brancher Firebase sans toucher à l'UI.

## Brancher Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com),
   activez **Firestore**.
2. Copiez `.env.example` en `.env` et remplissez les valeurs (Paramètres du
   projet → Vos applications → SDK Config).
3. Créez deux collections dans Firestore :

   **`halls`** — un document par salle, mêmes champs que
   `src/data/mockHalls.js` (voir `src/types/index.js` pour le détail) :
   `name, city, district, location {lat, lng}, pricePerHour, currency,
   pitchQuality, pitchQualityScore, photos[], availability[], amenities[],
   capacity, description, phone, rating, reviewsCount`.

   **`banners`** — un document par bannière, mêmes champs que
   `src/data/mockBanners.js` : `title, content, photo, startDate, endDate,
   type, linkedHallId?`.

4. Relancez `npm run dev`. `isFirebaseConfigured` passe automatiquement à
   `true` et les données viennent de Firestore — zéro changement de code
   ailleurs dans l'app.

### Règles de sécurité Firestore suggérées (lecture publique, écriture admin)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /halls/{hallId} {
      allow read: if true;
      allow write: if false; // à gérer depuis une console d'admin
    }
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Pistes d'évolution

- Authentification client (réservation en un clic, historique des réservations)
- Calendrier de réservation en temps réel par créneau (au lieu d'une simple
  disponibilité par jour)
- Paiement en ligne
- Avis clients avec upload de photo
- Notifications push sur les nouvelles offres
- Panneau d'administration pour gérer salles et bannières sans toucher au code
