import express from 'express';
import pool from '../db/index.js';
import { ensureAuth } from '../middlewares/auth.js';
const router = express.Router();

// criar empréstimo
router.post('/', ensureAuth, async (req,res)=>{
  const { usuarioId, materialId, prazoDias=14 } = req.body;
  try{
    const mat = (await pool.query('SELECT disponiveis FROM materials WHERE id=$1', [materialId])).rows[0];
    if(!mat || mat.disponiveis <= 0) return res.status(400).json({ message: 'Material indisponível' });
    const dataPrev = new Date(Date.now() + prazoDias*24*60*60*1000);
    const { rows } = await pool.query('INSERT INTO emprestimos (usuario_id,material_id,data_prevista_devolucao) VALUES ($1,$2,$3) RETURNING *', [usuarioId, materialId, dataPrev]);
    await pool.query('UPDATE materials SET disponiveis = disponiveis - 1 WHERE id=$1', [materialId]);
    res.status(201).json(rows[0]);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao criar empréstimo' }) }
});

// devolver
router.put('/:id/devolver', ensureAuth, async (req,res)=>{
  const { id } = req.params;
  try{
    const empre = (await pool.query('SELECT * FROM emprestimos WHERE id=$1', [id])).rows[0];
    if(!empre) return res.status(404).json({ message:'Empréstimo não encontrado' });
    if(empre.data_devolucao) return res.status(400).json({ message:'Já devolvido' });
    const now = new Date();
    let multa = 0;
    if(now > new Date(empre.data_prevista_devolucao)){
      const diff = Math.ceil((now - new Date(empre.data_prevista_devolucao)) / (24*60*60*1000));
      multa = diff * 1.0; // R$1 por dia — ajuste conforme regra
      await pool.query('INSERT INTO multas (emprestimo_id, usuario_id, valor) VALUES ($1,$2,$3)', [id, empre.usuario_id, multa]);
    }
    await pool.query('UPDATE emprestimos SET data_devolucao=$1, status=$2, valor_multa=$3 WHERE id=$4', [now, 'Devolvido', multa, id]);
    await pool.query('UPDATE materials SET disponiveis = disponiveis + 1 WHERE id=$1', [empre.material_id]);
    res.json({ message:'Devolvido', multa });
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao devolver' }) }
});

// renovar
router.post('/:id/renovar', ensureAuth, async (req,res)=>{
  const { id } = req.params;
  try{
    const empre = (await pool.query('SELECT * FROM emprestimos WHERE id=$1', [id])).rows[0];
    if(!empre) return res.status(404).json({ message:'Empréstimo não encontrado' });
    if(empre.renovacoes >= 2) return res.status(400).json({ message:'Máximo de renovações atingido' });
    if(empre.valor_multa > 0) return res.status(400).json({ message:'Multa pendente' });
    const nova = new Date(new Date(empre.data_prevista_devolucao).getTime() + 7*24*60*60*1000);
    const { rows } = await pool.query('UPDATE emprestimos SET data_prevista_devolucao=$1, renovacoes = renovacoes + 1 WHERE id=$2 RETURNING *', [nova, id]);
    res.json(rows[0]);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao renovar' }) }
});

// listar por usuario
router.get('/user/:id', ensureAuth, async (req,res)=>{
  const { id } = req.params;
  try{
    const { rows } = await pool.query(`SELECT e.*, m.titulo as material_titulo FROM emprestimos e JOIN materials m ON m.id = e.material_id WHERE e.usuario_id = $1 ORDER BY e.data_emprestimo DESC`, [id]);
    res.json(rows);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro ao buscar', err }) }
});

// listar atrasados
router.get('/atrasados', ensureAuth, async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT e.*, u.name as usuario_name, m.titulo FROM emprestimos e JOIN users u ON u.id = e.usuario_id JOIN materials m ON m.id = e.material_id WHERE e.data_devolucao IS NULL AND e.data_prevista_devolucao < NOW()`);
    res.json(rows);
  }catch(err){ console.error(err); res.status(500).json({ message:'Erro' }) }
});

export default router;
