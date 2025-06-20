#!/usr/bin/env bash
set -euo pipefail

echo "Redémarrage complet de la stack Docker"
docker compose down -v
docker compose up -d --build redis mongo neo4j backend frontend prometheus

echo "Attente que l’API soit prête..."
until curl -s http://localhost:3000/login -o /dev/null; do sleep 1; done
echo "API disponible"

# echo "Seed Mongo + Neo4j"
# docker compose exec -T backend node scripts/seed_mongo_full.js
# docker compose exec -T backend node scripts/seed_neo4j.js
echo "Environnement prêt : front http://localhost:5173  |  API http://localhost:3000"
