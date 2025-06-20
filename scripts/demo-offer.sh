#!/usr/bin/env bash
set -euo pipefail
API=http://localhost:3000

echo "Liste avant insertion"
curl -s "$API/offers?from=PAR&to=TYO&limit=5" | jq .

echo "Insertion d’une nouvelle offre"
curl -s -X POST "$API/offers" -H 'Content-Type: application/json' -d '{
  "provider":"AirDemoCLI",
  "from":"PAR","to":"TYO",
  "price":499,"currency":"EUR",
  "departDate":"2025-07-10","returnDate":"2025-07-20"
}' | jq .

echo "Liste après insertion (cache invalidé)"
curl -s "$API/offers?from=PAR&to=TYO&limit=5" | jq .
