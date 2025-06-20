#!/usr/bin/env bash
set -euo pipefail

DB=taBase
COL=offers

echo "==== Index présents sur $DB.$COL ===="
docker compose exec -T mongo \
  mongosh "$DB" --quiet --eval \
  'db.'"$COL"'.getIndexes().forEach(i => printjson(i))'

echo
echo "==== Plan d exécution : find({from:\"PAR\",to:\"TYO\"}).sort({price:1}).limit(1) ===="
docker compose exec -T mongo \
  mongosh "$DB" --quiet --eval '
    printjson(
      db.'"$COL"'.find({from:"PAR",to:"TYO"}).sort({price:1}).limit(1).explain("executionStats")
      .queryPlanner.winningPlan
    )'
