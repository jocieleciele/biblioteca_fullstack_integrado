// backend/src/routes/users.js
import express from 'express'
import bcrypt from 'bcryptjs'

const router = express.Router()

// GET users (protegido) — se quiser mantê-lo, deixe verifyToken
router.get('/', async (req, res) => {
  try {
    const r = await req.db.query('SELECT id, name, email, role FROM users ORDER BY name')
    res.json({ users: r.rows })
  } catch (err) { console.error(err); res.status(500).json({ error:'db error' }) }
})

// POST public: cadastro básico (nome,email,senha,confirmação no front)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios' })

    // verifica se já existe
    const exists = await req.db.query('SELECT id FROM users WHERE email=$1', [email])
    if (exists.rowCount > 0) return res.status(400).json({ error: 'Email já cadastrado' })

    const hashed = await bcrypt.hash(password, 10)
    const r = await req.db.query(
      'INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
      [name, email, hashed, role || 'Leitor']
    )
    res.status(201).json({ user: r.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error:'db error' })
  }
})

export default router

