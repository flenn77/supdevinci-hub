// backend/scripts/seed_mongo_full.js
import { mongoClient } from '../src/db.js';

await mongoClient.connect();
const db = mongoClient.db();

/* ─── jeu d’offres complet ─── */

const offers = [
  // ▼ vol simple
  {
    provider: 'AirDemo',
    from: 'PAR', to: 'TYO',
    price: 599, currency: 'EUR',
    departDate: '2025-07-01', returnDate: '2025-07-15',
    legs: [
      { flight: 'AD123', dep: 'PAR', arr: 'DXB', time: '2025-07-01T08:00' },
      { flight: 'AD456', dep: 'DXB', arr: 'TYO', time: '2025-07-01T15:00' }
    ],
    hotel: null,
    activity: null
  },
  // ▼ package vol+hotel
  {
    provider: 'PackTravel',
    from: 'NYC', to: 'LON',
    price: 950, currency: 'USD',
    departDate: '2025-08-05', returnDate: '2025-08-15',
    legs: [{ flight: 'PT789', dep: 'NYC', arr: 'LON', time: '2025-08-05T09:30' }],
    hotel: {
      name: 'London Inn',
      stars: 4,
      nights: 10
    },
    activity: null
  },
  // ▼ package complet
  {
    provider: 'AllInclusive',
    from: 'PAR', to: 'DXB',
    price: 1290, currency: 'EUR',
    departDate: '2025-09-10', returnDate: '2025-09-20',
    legs: [{ flight: 'AI321', dep: 'PAR', arr: 'DXB', time: '2025-09-10T12:00' }],
    hotel: { name: 'Palm Resort', stars: 5, nights: 10 },
    activity: { type: 'Desert Safari', date: '2025-09-15' }
  },
  // ▼ vol retour
  {
    provider: 'FlyAway',
    from: 'TYO', to: 'PAR',
    price: 620, currency: 'EUR',
    departDate: '2025-07-15', returnDate: '2025-07-30',
    legs: [
      { flight: 'FA789', dep: 'TYO', arr: 'DXB', time: '2025-07-15T10:00' },
      { flight: 'FA012', dep: 'DXB', arr: 'PAR', time: '2025-07-15T18:00' }
    ],
    hotel: null,
    activity: null
  },
  {
    provider: 'EuroFlights',
    from: 'LON', to: 'NYC',
    price: 750, currency: 'GBP',
    departDate: '2025-08-15', returnDate: '2025-08-25',
    legs: [{ flight: 'EF345', dep: 'LON', arr: 'NYC', time: '2025-08-15T11:00' }],
    hotel: { name: 'Big Apple Hotel', stars: 3, nights: 10 },
    activity: { type: 'Statue of Liberty Tour', date: '2025-08-20' }
  },
  // ▼ vol avec escale
  {
    provider: 'SkyWings',
    from: 'PAR', to: 'DXB',
    price: 580, currency: 'EUR',
    departDate: '2025-10-01', returnDate: '2025-10-15',
    legs: [
      { flight: 'SW456', dep: 'PAR', arr: 'IST', time: '2025-10-01T07:00' },
      { flight: 'SW789', dep: 'IST', arr: 'DXB', time: '2025-10-01T14:00' }
    ],
    hotel: null,
    activity: null
  },
  // ▼ package vol+activité
  {
    provider: 'AdventureTrips',
    from: 'DXB', to: 'PAR',
    price: 1100, currency: 'EUR',
    departDate: '2025-11-05', returnDate: '2025-11-20',
    legs: [{ flight: 'AT123', dep: 'DXB', arr: 'PAR', time: '2025-11-05T08:00' }],
    hotel: { name: 'Parisian Stay', stars: 4, nights: 15 },
    activity: { type: 'Eiffel Tower Dinner', date: '2025-11-10' }
  },
  // ▼ vol direct
  {
    provider: 'DirectAir',
    from: 'TYO', to: 'LON',
    price: 700, currency: 'JPY',
    departDate: '2025-12-01', returnDate: '2025-12-15',
    legs: [{ flight: 'DA456', dep: 'TYO', arr: 'LON', time: '2025-12-01T09:00' }],
    hotel: { name: 'London Central', stars: 3, nights: 14 },
    activity: { type: 'London Eye Tour', date: '2025-12-05' }
  },
  // ▼ package vol+hotel+activité
  {
    provider: 'CompleteTravel',
    from: 'PAR', to: 'NYC',
    price: 1500, currency: 'EUR',
    departDate: '2025-01-10', returnDate: '2025-01-25',
    legs: [{ flight: 'CT789', dep: 'PAR', arr: 'NYC', time: '2025-01-10T10:00' }],
    hotel: { name: 'NYC Grand Hotel', stars: 5, nights: 15 },
    activity: { type: 'Broadway Show', date: '2025-01-15' }
  },
  // ▼ vol avec correspondance
  {
    provider: 'GlobalFlights',
    from: 'NYC', to: 'LON',
    price: 800, currency: 'GBP',
    departDate: '2025-02-05', returnDate: '2025-02-20',
    legs: [
      { flight: 'GF123', dep: 'LON', arr: 'FRA', time: '2025-02-05T06:00' },
      { flight: 'GF456', dep: 'FRA', arr: 'DXB', time: '2025-02-05T14:00' }
    ],
    hotel: { name: 'Dubai Luxury', stars: 5, nights: 15 },
    activity: { type: 'Desert Safari', date: '2025-02-10' }
  }

];

/* ─── insertion ─── */
await db.collection('offers').deleteMany({});
await db.collection('offers').insertMany(offers);
console.log(`${offers.length} offres insérées (full seed)`);

await mongoClient.close();
