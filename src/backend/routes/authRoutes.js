import express from 'express';
import { loginUser, registerUser } from '../services/authService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, role, provider, providerId } = req.body;
  const result = await registerUser(username, password, role, provider, providerId);
  if (!result.success) return res.status(400).json({ error: result.error });
  res.status(201).json({ message: 'User registered', user: result.user });
});

router.post('/login', async (req, res) => {
  const { username, password, provider, providerId } = req.body;
  const result = await loginUser({ username, password, provider, providerId });
  if (!result.success) return res.status(401).json({ error: result.error });
  res.json({ message: 'Login successful', token: result.token, user: result.user });
});

export default router