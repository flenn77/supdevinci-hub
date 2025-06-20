#!/usr/bin/env bash
set -euo pipefail

NEO_USER=neo4j
NEO_PWD=SupDev1234

echo "=== Contrainte 'city_code' ==="
docker compose exec -T neo4j cypher-shell -u "$NEO_USER" -p "$NEO_PWD" \
  "SHOW CONSTRAINTS WHERE name = 'city_code'"

echo
echo "=== Test d'insertion doublon City.code ==="

# on désactive temporairement -e pour pouvoir tester le code retour
set +e
docker compose exec -T neo4j \
  cypher-shell --fail-fast -u "$NEO_USER" -p "$NEO_PWD" \
  -e "CREATE (:City {code:'PAR', name:'Paris duplicate'})" \
  1>/dev/null 2>&1
RC=$?
set -e  # on ré-active l’arrêt sur erreur

if [[ $RC -eq 0 ]]; then
  echo " Doublon ACCEPTÉ  → la contrainte n’est PAS en place!"
  # nettoyage pour ne pas garder une ville en doublon
  docker compose exec -T neo4j \
    cypher-shell -u "$NEO_USER" -p "$NEO_PWD" \
    -e "MATCH (c:City {code:'PAR', name:'Paris duplicate'}) DETACH DELETE c"
  exit 1
else
  echo " Doublon REJETÉ  : contrainte OK"
fi
