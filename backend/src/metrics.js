// backend/src/metrics.js
import client from 'prom-client';

client.collectDefaultMetrics({ prefix: 'supdevinci_' });

export const httpDuration = new client.Histogram({
  name: 'supdevinci_http_duration_seconds',
  help: 'Durée des requêtes HTTP (s)',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export const cacheHit  = new client.Counter({
  name: 'supdevinci_cache_hit_total',
  help: 'Nombre de hits cache'
});

export const cacheMiss = new client.Counter({
  name: 'supdevinci_cache_miss_total',
  help: 'Nombre de miss cache'
});

export const register = client.register;        // ré-export
