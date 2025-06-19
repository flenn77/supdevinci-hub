// backend/src/routes/login.js
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Le paramètre "userId" est obligatoire.' });
  }
  const token = uuidv4();
  // On stocke la session dans Redis : clé session:<token> → userId, TTL 900s
  await redis.set(`session:${token}`, userId, 'EX', 900);
  return res.json({ token, expires_in: 900 });
});

export default router;
