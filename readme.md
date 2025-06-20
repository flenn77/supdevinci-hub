# SupDeVinci Travel Hub – README

*Micro-service (Express + Redis + MongoDB + Neo4j) – front React – monitoring Prometheus*
**Objectif perf.** : ≤ 200 ms (cache hit) &  ≤ 700 ms (cache miss) sur la route la plus sollicitée.

---

## 1. Contenu du dépôt

| Dossier / fichier           | Rôle                                                               |
| :-------------------------- | :----------------------------------------------------------------- |
| `backend/`                  | API Express, métriques Prometheus, scripts *seed* & bench          |
| `frontend/`                 | Application React / Vite (recherche d’offres & reco)               |
| `prometheus/prometheus.yml` | Configuration de scrape du backend                                 |
| `scripts/`                  | Helpers CLI (*demo-up, seed-mongo, seed-neo4j, charge, …*)         |
| `docker-compose.yml`        | Stack complète : Redis, MongoDB, Neo4j, backend, front, Prometheus |

---

## 2. Lancement rapide

### 2.1 Stack « tout-en-un »

```bash
# Terminal A : build complet + montée de tous les conteneurs
./scripts/demo-up.sh          # ~ 1 min la toute première fois
```

```
Environnement prêt :
  Frontend    http://localhost:5173
  API         http://localhost:3000
  Prometheus  http://localhost:9090
  Neo4j       http://localhost:7474   (neo4j / SupDev1234)
```

> `demo-up.sh` **ne charge pas** les jeux de données pour que l’on puisse les rejouer à volonté.

### 2.2 Injection des données (2 terminaux supplémentaires)

```bash
# Terminal B : seed MongoDB (catalogue d’offres)
./scripts/seed-mongo.sh          # garder la fenêtre ouverte pour voir les logs
```

```bash
# Terminal C : seed Neo4j (villes + relations NEAR)
./scripts/seed-neo4j.sh          # idem, on laisse tourner
```

Quand les deux scripts affichent `✔ seed exécuté`, la plateforme est prête ; le front peut appeler `/offers` et `/reco`, les benchs & tests temps-réel fonctionnent.

---

## 3. Architecture technique

```
┌───────────┐  Pub/Sub   ┌───────────┐
│   Redis   │◄────────┐ │  Frontend │  React + Vite
│ cache +   │          │ └───────────┘
│ sessions  │          │      ▲  fetch /offers /reco /login
└───────────┘          │      │
       ▲  gzip JSON 60/300 s  │
       │                     │
┌──────┴──────┐   MongoDB     │
│   Backend   │───────────────┘
│  Express    │   Neo4j           Prometheus
│  0.0.0.0:3000                  scrape /metrics
└─────────────┘
```

* **Redis**

  * `offers:<from>:<to>` – TTL 60 s
  * `offers:<id>` – TTL 300 s
  * `session:<uuid>` – TTL 900 s
  * canal Pub/Sub : `offers:new`
* **MongoDB**

  * collection `offers` (documents JSON)
  * indexes : `{from:1, to:1, price:1}` + index texte sur `provider`
* **Neo4j**

  * nœuds `(:City {code, name, country})`
  * relations `[:NEAR {weight}]`
  * contrainte d’unicité `City.code`

---

## 4. API HTTP

| Méthode & route                         | Fonction métier        | Flux interne                                                                  |
| :-------------------------------------- | :--------------------- | :---------------------------------------------------------------------------- |
| `GET  /offers?from=PAR&to=TYO&limit=10` | Recherche d’offres     | Cache Redis 60 s → Mongo trié `price` si miss (résultat gzip)                 |
| `GET  /offers/:id`                      | Détails d’une offre    | Cache Redis 300 s → Mongo → 3 ID liés (Neo4j pour les villes proches + Mongo) |
| `POST /offers`                          | Création d’offre       | Insert Mongo → `DEL offers:<from>:<to>` → `PUBLISH offers:new …`              |
| `GET  /reco?city=PAR&k=3`               | Recommandations villes | Cypher `MATCH (c)-[:NEAR]->(n)` tri `weight`                                  |
| `POST /login` `{userId}`                | Authn légère           | Génère UUID v4 → `session:<uuid>` TTL 900 s                                   |
| `GET  /metrics`                         | Metrics Prometheus     | Histogramme HTTP + compteurs cacheHit / cacheMiss                             |

Toutes les réponses : `application/json; charset=utf-8`.

---

## 5. Scripts CLI utiles

| Script (dossier `scripts/`) | Ce qu’il fait                                                                          |
| :-------------------------- | :------------------------------------------------------------------------------------- |
| `demo-up.sh`                | Build + montée de la stack (sans seed)                                                 |
| `seed-mongo.sh`             | Jeu d’offres complet → MongoDB                                                         |
| `seed-neo4j.sh`             | Villes & relations → Neo4j                                                             |
| `index-mongodb.sh`          | Affiche les index et le *query-plan* optimisé                                          |
| `constraint-neo4j.sh`       | Montre la contrainte `city_code` puis teste un doublon                                 |
| `redis-listen.sh`           | `redis-cli SUBSCRIBE offers:new` (écoute temps réel)                                   |
| `charge.sh`                 | Flush cache → mesure **MISS/HIT** (`time`) → charge 15 s, 20 connexions (`autocannon`) |

---

## 6. Tests rapides

### 6.1 Authentification & session Redis

```bash
# créer une session
curl -s -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"userId":"u42"}' | jq .
#▶ { "token":"<UUID>", "expires_in":900 }

# vérifier côté Redis
docker compose exec -T redis redis-cli
> GET  session:<UUID>
"u42"
> TTL  session:<UUID>
(…)
```

### 6.2 Notification temps-réel

```bash
# Terminal D : abonné au canal
./scripts/redis-listen.sh
```

```bash
# Terminal E : insertion live
curl -X POST http://localhost:3000/offers \
  -H "Content-Type: application/json" \
  -d '{
    "provider":"LiveDemo",
    "from":"PAR","to":"TYO",
    "price":450,"currency":"EUR",
    "departDate":"2025-07-10","returnDate":"2025-07-20"
  }'
```

> Le message JSON apparaît aussitôt dans le terminal D.

---

## 7. Performance cible

Extrait de `./scripts/charge.sh` :

```
MISS : 18 ms      HIT : 13 ms
autocannon (15 s, 20 conn.) :
  p95 latency ≈ 22-25 ms
  ~1 370 req/s
```

→ sous les 200 ms (hit) et 700 ms (miss) exigés.

---

## 8. Monitoring Prometheus

* **Metrics exposées**
  `supdevinci_http_duration_seconds` (Histogram)
  `supdevinci_cache_hit_total`, `supdevinci_cache_miss_total` (Counters)

  * metrics système par `prom-client`

* **UI** :[http://localhost:9090](http://localhost:9090)

Requêtes utiles :

```promql
rate(supdevinci_cache_hit_total[1m])
histogram_quantile(0.95, rate(supdevinci_http_duration_seconds_bucket[1m]))
```

---

## 9. Lancement « à la carte » (optionnel)

```bash
docker compose up -d           # stack brute, sans jeu de données
./scripts/seed-mongo.sh
./scripts/seed-neo4j.sh
./scripts/index-mongodb.sh      # vérifier l’index
./scripts/constraint-neo4j.sh   # vérifier la contrainte
./scripts/charge.sh             # bench
```

