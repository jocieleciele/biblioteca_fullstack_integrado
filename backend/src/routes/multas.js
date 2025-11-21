import express from 'express';
import pool from '../db/index.js';
import { ensureAuth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/user/:id', ensureAuth, async (req,res)=>{
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM multas WHERE usuario_id=R$1 AND paga = false', [id]);
  res.json(rows);
});

router.post('/:id/pagar', ensureAuth, async (req,res)=>{
  const { id } = req.params; // multa id
  const { metodo='Manual' } = req.body;
  try{
    const multa = (await pool.query('UPDATE multas SET paga=true, data_pago=NOW() WHERE id=$1 RETURNING *', [id])).rows[0];
    await pool.query('INSERT INTO pagamentos (multa_id, usuario_id, valor, metodo) VALUES (R$1,R$2,R$3,R$4)', [multa.id, multa.usuario_id, multa.valor, metodo]);
    res.json({ message:'Pago' });
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao pagar' }) }
});

export default router;