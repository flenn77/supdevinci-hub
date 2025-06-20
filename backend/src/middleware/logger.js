import { httpDuration } from '../metrics.js'; 

export default function durationLogger(req, res, next) {
  const start = Date.now();

  res.once('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms} ms)`);

    // Prometheus
    httpDuration
      .labels(req.method, req.route?.path || req.originalUrl, res.statusCode)
      .observe(ms / 1000);
  });

  next();
}
