import express from 'express';
import pool from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT = Number(process.env.SALT_ROUNDS) || 10;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const hashed = await bcrypt.hash(password, SALT);
  try {
    const { rows } = await pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email,role', [name, email, hashed]);
    res.status(201).json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Email já cadastrado' });
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erro no servidor' }); }
});

export default router;