# SupDeVinci Travel Hub – README 

> **Poly-glot micro-service (Express + Redis + MongoDB + Neo4j) + front React + monitoring Prometheus**
> Objectif : **≤ 200 ms** de latence (cache hit) et **≤ 700 ms** (cache miss) pour la route la plus sollicitée.

---

## 1. Contenu du dépôt

| Dossier / fichier           | Rôle                                                             |
| --------------------------- | ---------------------------------------------------------------- |
| `backend/`                  | API Express + tests de perfs + scripts de seed                   |
| `frontend/`                 | App React Vite (recherche d’offres & reco)                       |
| `prometheus/prometheus.yml` | config scrape du backend                                         |
| `scripts/`                  | Helpers CLI (*demo-up, bench, index, seed…*)                     |
| `docker-compose.yml`        | Stack complète (Redis, Mongo, Neo4j, backend, front, Prometheus) |

---

## 2. Démarrage rapide 

```bash
1. build, seed, lancement désenfumé
./scripts/demo-up.sh      # (~ 1 min la 1ʳᵉ fois)
```
```bash
2. URLs utiles
 - Frontend         : http://localhost:5173
 - API backend      : http://localhost:3000
 - Prometheus UI    : http://localhost:9090
 - Neo4j Browser    : http://localhost:7474 (neo4j / SupDev1234)
```

`demo-up.sh` fait :

1. `docker compose down -v && up -d --build …`
2. Attente du backend (health-check sur `/login`)
3. Seed **Mongo** (`seed_mongo_full.js`) + **Neo4j** (`seed_neo4j.js`)
4. Affiche les URLs finaux.

> La stack vit dans le réseau compose, donc front & Prometheus pointent directement sur **backend:3000**.

---

## 3. Architecture

```
┌──────────┐     Pub/Sub      ┌──────────┐
│  Redis   │◄─────────────┐   │ Frontend │  React+Vite
│  cache   │               │   └──────────┘
└──────────┘               │        ▲   fetch /offers /reco /login
       ▲    gzip JSON      │        │
       │   TTL 60 / 300 s  │        │
       │                   │        │
┌──────┴──────┐   Mongoose  │        │
│   Backend   │─────────────┘        │
│  Express    │  MongoDB          Prometheus
│  0.0.0.0:3000   Neo4j            scrape /metrics
└─────────────┘
```

* **Redis** – clés

  * `offers:<from>:<to>` 60 s
  * `offers:<id>` 300 s
  * `session:<uuid>` 900 s
  * canal Pub/Sub `offers:new`
* **MongoDB** – collection `offers`
  index `{from:1, to:1, price:1}` + texte sur `provider`.
* **Neo4j** – nœuds `(:City)` + relation `[:NEAR {weight}]`
  Contrainte unique `City.code`.

---

## 4. API HTTP

| Méthode & route                        | Fonction           | Détail / flux interne                                              |
| -------------------------------------- | ------------------ | ------------------------------------------------------------------ |
| `GET /offers?from=PAR&to=TYO&limit=10` | Recherche d’offres | Cache Redis TTL 60 → Mongo trié `price` si miss (+ gzip)           |
| `GET /offers/:id`                      | Détail 1 offre     | Cache Redis TTL 300 → Mongo → reco 3 IDs (Neo4j + Mongo)           |
| `POST /offers`                         | Création offre     | Insert Mongo, `DEL offers:<from>:<to>`, `PUBLISH offers:new {...}` |
| `GET /reco?city=PAR&k=3`               | Villes proches     | Cypher `MATCH (c)-[:NEAR]->(n)` ordre `weight`                     |
| `POST /login` JSON `{userId}`          | Authn légère       | UUID v4 → `session:<uuid>` TTL 900                                 |
| `GET /metrics`                         | Prometheus         | Histogramme HTTP + compteurs cacheHit/cacheMiss                    |

Toutes les réponses sont `application/json; charset=utf-8`.

---

## 5. Scripts CLI utiles (dossier `scripts/`)

| Script                            | Ce qu’il fait                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `demo-up.sh`                      | (re)build complet + seed & lancement                                                                        |
| `seed-mongo.sh` / `seed-neo4j.sh` | Seed isolé de chaque base + vérification                                                                    |
| `index-mongodb.sh`                | Affiche les index & plan d’exécution optimisé                                                               |
| `constraint-neo4j.sh`             | Montre la contrainte `city_code` + test doublon                                                             |
| `redis-listen.sh`                 | `redis-cli SUBSCRIBE offers:new` en direct                                                                  |
| `bench-hey.sh`                    | Flush cache, mesure **MISS / HIT** (`time`), puis charge 15 s – 20 connexions avec `autocannon` (via `npx`) |

---

## 6. Performance cible 

Exemple de résultat (`bench-hey.sh`) :

```
MISS : 18 ms      HIT : 13 ms
autocannon (15s, 20 conn.) :
  p95 latency = 22-25 ms
  ~1 370 req/s
```

→ largement sous les 200 ms (hit) et 700 ms (miss) demandés.

---

## 7. Monitoring Prometheus

* **Metrics exposées** :
  `supdevinci_http_duration_seconds` *(Histogram)*
  `supdevinci_cache_hit_total`, `supdevinci_cache_miss_total` *(Counters)*

  * `prom-client` default (CPU, GC, etc.).
* **Prometheus UI** : [http://localhost:9090](http://localhost:9090)
  Exemple de requête :

  ```
  rate(supdevinci_cache_hit_total[1m])
  histogram_quantile(0.95, rate(supdevinci_http_duration_seconds_bucket[1m]))
  ```

---

## 8. Build manuel (alternative)

```bash
docker compose up -d           # stack sans seed
./scripts/seed-mongo.sh        # BSON d’exemple
./scripts/seed-neo4j.sh
./scripts/bench-hey.sh
```


