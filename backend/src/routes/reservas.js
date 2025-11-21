import express from 'express';
import pool from '../db/index.js';
import { ensureAuth, ensureRole } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', ensureAuth, async (req,res)=>{
  const { usuarioId, materialId } = req.body;
  try{
    const { rows } = await pool.query('INSERT INTO reservas (usuario_id, material_id) VALUES ($1,$2) RETURNING *', [usuarioId, materialId]);
    res.status(201).json(rows[0]);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao criar reserva' }) }
});

router.get('/user/:id', ensureAuth, async (req,res)=>{
  const { id } = req.params;
  const { rows } = await pool.query('SELECT r.*, m.titulo as material_titulo FROM reservas r JOIN materials m ON m.id = r.material_id WHERE r.usuario_id=$1 ORDER BY r.data_reserva DESC', [id]);
  res.json(rows);
});

router.get('/', ensureAuth, ensureRole(['Bibliotecario','Administrador']), async (req,res)=>{
  const { rows } = await pool.query(`SELECT r.*, u.name as usuario_name, m.titulo as material_titulo FROM reservas r JOIN users u ON u.id = r.usuario_id JOIN materials m ON m.id = r.material_id WHERE r.atendida = false`);
  res.json(rows);
});

router.put('/:id/atender', ensureAuth, ensureRole(['Bibliotecario','Administrador']), async (req,res)=>{
  const { id } = req.params;
  try{
    const r = (await pool.query('UPDATE reservas SET atendida = true, status = $1 WHERE id=$2 RETURNING *', ['Atendida', id])).rows[0];
    // opcional: notificar usuário
    res.json(r);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro' }) }
});

router.delete('/:id', ensureAuth, async (req,res)=>{
  await pool.query('DELETE FROM reservas WHERE id=$1', [req.params.id]);
  res.json({ message:'Cancelada' });
});

export default router;
