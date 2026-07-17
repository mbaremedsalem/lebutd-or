/**
 * Ce fichier documente la forme EXACTE des documents Firestore attendus.
 * Aucune valeur ici n'est exécutée : c'est un contrat de données que les
 * mocks (src/data) et les services (src/services) respectent tous les deux.
 * Le jour où Firebase est branché, les documents doivent avoir cette forme
 * pour que rien d'autre dans l'app n'ait besoin de changer.
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} day        - 'lundi' | 'mardi' | ... | 'dimanche'
 * @property {string} open       - heure d'ouverture, format 'HH:mm'
 * @property {string} close      - heure de fermeture, format 'HH:mm'
 */

/**
 * @typedef {Object} Hall  - Une salle / terrain de football
 * @property {string} id
 * @property {string} name              - Nom de la salle
 * @property {string} city              - Ville
 * @property {string} district          - Quartier
 * @property {{ lat: number, lng: number }} location
 * @property {number} pricePerHour       - Prix pour 1h, en devise locale
 * @property {string} currency           - ex. 'MRU', 'MAD', 'EUR'
 * @property {'excellent'|'bon'|'moyen'|'a_renover'} pitchQuality - état du terrain
 * @property {number} pitchQualityScore  - note 1 à 5 (dérivée ou saisie à la main)
 * @property {string[]} photos           - URLs des photos de la salle
 * @property {TimeSlot[]} availability    - créneaux disponibles par jour
 * @property {string[]} amenities        - ex. 'vestiaires', 'douches', 'parking', 'éclairage'
 * @property {number} capacity           - nombre de joueurs (ex. 5, 7, 11)
 * @property {string} description
 * @property {string} phone
 * @property {number} rating             - note moyenne des clients (0-5)
 * @property {number} reviewsCount
 */

/**
 * @typedef {Object} Banner  - Une bannière promotionnelle (offre, tirage, cadeau, ballon...)
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} photo
 * @property {string} startDate   - ISO date 'YYYY-MM-DD'
 * @property {string} endDate     - ISO date 'YYYY-MM-DD'
 * @property {'offre'|'tirage'|'cadeau'|'autre'} type
 * @property {string} [linkedHallId] - salle concernée par l'offre, optionnel
 */

export {};
