import { Router } from 'express';
import neo4j, { int } from 'neo4j-driver';
import { neo4jDriver } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { city, k = 3 } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'Le paramètre "city" est obligatoire.' });
  }
  const kInt = parseInt(k, 10);

  try {
    const session = neo4jDriver.session();
    const result = await session.run(
      `
      MATCH (c:City {code:$city})-[r:NEAR]->(n:City)
      RETURN n.code AS city, r.weight AS score
      ORDER BY r.weight DESC
      LIMIT $k
      `,
      { city, k: int(kInt) }
    );
    await session.close();

    console.log(`Found ${result.records.length} reco(s) for city=${city}`);

    // Mapping corrigé
    const recos = result.records.map(record => {
      const rawScore = record.get('score');
      const score =
        typeof rawScore === 'object' && typeof rawScore.toNumber === 'function'
          ? rawScore.toNumber()
          : rawScore;
      return {
        city: record.get('city'),
        score
      };
    });

    return res.json(recos);
  } catch (err) {
    console.error('Erreur /reco:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;
