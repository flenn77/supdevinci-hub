// backend/src/app.js
import express from 'express';
import dotenv from 'dotenv';
import durationLogger from './middleware/logger.js';
import offersRouter from './routes/offers.js';
import recoRouter from './routes/reco.js';
import loginRouter from './routes/login.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',  // Remplace par ton URL front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(durationLogger);

// Monte les routes
app.use('/offers', offersRouter);
app.use('/reco', recoRouter);
app.use('/login', loginRouter);

export default app;
