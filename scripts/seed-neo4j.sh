#!/usr/bin/env bash
set -euo pipefail

echo "Seed Neo4j…"
docker compose exec -T backend node scripts/seed_neo4j.js
echo "✔ Neo4j – seed exécuté"

echo "Seed Neo4j terminé"
exit 0
