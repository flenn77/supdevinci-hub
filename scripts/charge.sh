#!/usr/bin/env bash


# 0) purge
docker compose exec -T redis redis-cli FLUSHALL

# 1) miss / hit manuels
time curl -s "http://localhost:3000/offers?from=PAR&to=TYO&limit=1" > /dev/null
time curl -s "http://localhost:3000/offers?from=PAR&to=TYO&limit=1" > /dev/null

# 2) charge 15 s, 20 connexions
docker compose exec -T backend \
  npx -y autocannon -c 20 -d 15 "http://localhost:3000/offers?from=PAR&to=TYO&limit=1"
