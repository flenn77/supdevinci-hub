// backend/src/middleware/logger.js
export default function durationLogger(req, res, next) {
  const start = Date.now();
  res.once('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms} ms)`);
  });
  next();
}
