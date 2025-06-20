#!/usr/bin/env bash
set -euo pipefail

echo "Seed Mongo (offres complètes)…"
docker compose exec -T backend node scripts/seed_mongo_full.js
echo "✔ Mongo – seed exécuté"

echo "Seed Mongo terminé"
exit 0
