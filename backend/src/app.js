// backend/src/app.js
import express from 'express';
import dotenv from 'dotenv';
import durationLogger from './middleware/logger.js';
import offersRouter from './routes/offers.js';
import recoRouter from './routes/reco.js';
import loginRouter from './routes/login.js';
import cors from 'cors';
import { register } from './metrics.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // Remplace par ton URL front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(durationLogger);

// Monte les routes
app.use('/offers', offersRouter);
app.use('/reco', recoRouter);
app.use('/login', loginRouter);

// ─── Prometheus endpoint ─────────────
app.get('/metrics', async (_, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
