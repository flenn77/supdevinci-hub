// backend/src/routes/offers.js
import { Router } from 'express';
import { db, redis, neo4jDriver } from '../db.js';
import { cacheHit, cacheMiss }   from '../metrics.js';
import { gzip as gzipCb, gunzip as gunzipCb } from 'zlib';
import { promisify } from 'util';
import { ObjectId } from 'mongodb';

const gzip = promisify(gzipCb);
const gunzip = promisify(gunzipCb);

const router = Router();

/** GET /offers?from=PAR&to=TYO&limit=10 */
router.get('/', async (req, res) => {
  const { from, to, limit = 10 } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Les paramètres "from" et "to" sont obligatoires.' });
  }
  const cacheKey = `offers:${from}:${to}`;
  try {
    const buf = await redis.getBuffer(cacheKey);
    if (buf) {
      console.log('→ cache hit');
      cacheHit.inc();
      return res.json(JSON.parse((await gunzip(buf)).toString()));
    }
    cacheMiss.inc();
    const offers = await db
      .collection('offers')
      .find({ from, to })
      .sort({ price: 1 })
      .limit(parseInt(limit, 10))
      .toArray();
    await redis.set(cacheKey, await gzip(JSON.stringify(offers)), 'EX', 60);
    console.log('→ cache miss');
    return res.json(offers);
  } catch (err) {
    console.error('Erreur /offers:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

/** GET /offers/:id */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `offers:${id}`;
  try {
    const buf = await redis.getBuffer(cacheKey);
    if (buf) {
      console.log('→ details cache hit');
      return res.json(JSON.parse((await gunzip(buf)).toString()));
    }
    const offer = await db
      .collection('offers')
      .findOne({ _id: new ObjectId(id) });
    if (!offer) {
      return res.status(404).json({ error: 'Offre non trouvée.' });
    }
    // --- RECO via Neo4j sur offer.from ---
    const session = neo4jDriver.session();
    const result = await session.run(
      `
      MATCH (c:City {code:$from})-[r:NEAR]->(n:City)
      RETURN n.code AS city
      ORDER BY r.weight DESC
      LIMIT 3
      `,
      { from: offer.from }
    );
    await session.close();
    const recCities = result.records.map(r => r.get('city'));
    // --- relatedOffers depuis MongoDB ---
    const relatedOffers = [];
    for (const city of recCities) {
      const rel = await db
        .collection('offers')
        .findOne({
          from: offer.from,
          to: city,
          departDate: offer.departDate,
          returnDate: offer.returnDate
        }, { projection: { _id: 1 } });
      if (rel) {
        relatedOffers.push(rel._id.toString());
        if (relatedOffers.length >= 3) break;
      }
    }
    const detailed = { ...offer, relatedOffers };
    await redis.set(cacheKey, await gzip(JSON.stringify(detailed)), 'EX', 300);
    console.log('→ details cache miss');
    return res.json(detailed);
  } catch (err) {
    console.error('Erreur /offers/:id', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});


router.post('/', async (req, res) => {
  const {
    provider, from, to, price, currency,
    departDate, returnDate,
    legs = [], hotel = null, activity = null
  } = req.body;

  // — Validation minimale —
  if (!provider || !from || !to || !price || !currency) {
    return res.status(400).json({
      error: 'Champs obligatoires : provider, from, to, price, currency'
    });
  }

  try {
    // insertion MongoDB
    const { insertedId } = await db.collection('offers').insertOne({
      provider, from, to, price, currency,
      departDate, returnDate,
      legs, hotel, activity
    });

    // Invalidation du cache liste « offers:<from>:<to> »
    await redis.del(`offers:${from}:${to}`);

    // Publication Pub/Sub
    await redis.publish(
      'offers:new',
      JSON.stringify({ offerId: insertedId.toString(), from, to })
    );

    return res.status(201).json({ id: insertedId });
  } catch (err) {
    console.error('Erreur POST /offers :', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});


export default router;
