// backend/src/index.js
import app from './app.js';
import { mongoClient, redis, neo4jDriver } from './db.js';

async function start() {
  // MongoDB
  await mongoClient.connect();
  console.log('MongoDB connecté');

  // Index requis sur la collection offers
  const offers = mongoClient.db().collection('offers');
  await offers.createIndex({ from: 1, to: 1, price: 1 });
  await offers.createIndex({ provider: 'text' });
  console.log('Index Mongo créés (from+to+price, texte provider)');

  // Redis (ioredis se connecte tout seul)
  redis.on('connect', () => console.log('Redis connecté'));
  redis.on('error', err => console.error('Erreur Redis:', err));

  // Neo4j
  await neo4jDriver.verifyConnectivity();
  console.log('Neo4j connecté');

  // Contrainte d’unicité sur City.code
  const neoSession = neo4jDriver.session({ defaultAccessMode: neo4jDriver.WRITE });
  await neoSession.run('CREATE CONSTRAINT city_code IF NOT EXISTS FOR (c:City) REQUIRE c.code IS UNIQUE');
  await neoSession.close();
  console.log(' Contrainte City.code UNIQUE créée (ou déjà existante)');

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API démarrée sur http://localhost:${port}`));
}

start().catch(err => {
  console.error('Erreur au démarrage :', err);
  process.exit(1);
});
