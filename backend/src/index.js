// backend/src/index.js
import app from './app.js';
import { mongoClient, redis, neo4jDriver } from './db.js';

async function start() {
  // MongoDB
  await mongoClient.connect();
  console.log('✔️ MongoDB connecté');

  // Redis (ioredis se connecte tout seul)
  redis.on('connect', () => console.log('✔️ Redis connecté'));
  redis.on('error', err => console.error('❌ Erreur Redis:', err));

  // Neo4j
  await neo4jDriver.verifyConnectivity();
  console.log('✔️ Neo4j connecté');

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API démarrée sur http://localhost:${port}`));
}

start().catch(err => {
  console.error('❌ Erreur au démarrage :', err);
  process.exit(1);
});
