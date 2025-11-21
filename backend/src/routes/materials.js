import express from 'express';
import pool from '../db/index.js';
import { ensureAuth, ensureRole } from '../middlewares/auth.js';

const router = express.Router();

// ===============================
// LISTAR TODOS + BUSCA
// ===============================
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();

  try {
    if (q) {
      const { rows } = await pool.query(`
        SELECT * FROM materials
        WHERE lower(titulo) LIKE $1
           OR lower(autor) LIKE $1
           OR lower(categoria) LIKE $1
      `, [`%${q}%`]);

      return res.json(rows);
    }

    const { rows } = await pool.query('SELECT * FROM materials ORDER BY titulo');
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar materiais' });
  }
});

// ===============================
// ROTA ESPECÍFICA PARA BUSCA (para o frontend)
// ===============================
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();

  try {
    const { rows } = await pool.query(`
      SELECT * FROM materials
      WHERE lower(titulo) LIKE $1
         OR lower(autor) LIKE $1
         OR lower(categoria) LIKE $1
    `, [`%${q}%`]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro na busca' });
  }
});

// ===============================
// RECOMENDADOS
// ===============================
router.get('/recommended', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM materials
      ORDER BY avaliacao DESC NULLS LAST
      LIMIT 8
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao carregar recomendados' });
  }
});

// ===============================
// DETALHES
// ===============================
router.get('/:id', async (req,res)=>{
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM materials WHERE id=$1', [id]);

  if (!rows[0]) {
    return res.status(404).json({ message: 'Material não encontrado' });
  }

  res.json(rows[0]);
});

// ===============================
// CRIAR
// ===============================
router.post('/', ensureAuth, ensureRole(['Bibliotecario','Administrador']), async (req,res)=>{
  const { titulo, autor, categoria, ano, capa, descricao, total=1 } = req.body;

  try {
    const { rows } = await pool.query(`
      INSERT INTO materials 
      (titulo,autor,categoria,ano,capa,descricao,total,disponiveis)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [titulo,autor,categoria,ano,capa,descricao,total,total]);

    res.status(201).json(rows[0]);

  } catch(err){
    console.error(err);
    res.status(500).json({ message:'Erro ao criar material' });
  }
});

// ===============================
// ATUALIZAR
// ===============================
router.put('/:id', ensureAuth, ensureRole(['Bibliotecario','Administrador']), async (req,res)=>{
  const { id } = req.params;
  const fields = Object.keys(req.body);

  if(fields.length===0){
    return res.status(400).json({ message:'Nada para atualizar' });
  }

  const sets = fields.map((f,i)=> `${f} = $${i+1}`).join(', ');
  const values = fields.map(f=> req.body[f]);
  values.push(id);

  try{
    const { rows } = await pool.query(
      `UPDATE materials SET ${sets} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json(rows[0]);

  }catch(err){
    console.error(err);
    res.status(500).json({ message:'Erro ao atualizar' });
  }
});

// ===============================
// DELETAR
// ===============================
router.delete('/:id', ensureAuth, ensureRole(['Administrador']), async (req,res)=>{
  try{
    await pool.query('DELETE FROM materials WHERE id=$1', [req.params.id]);
    res.json({ message:'Deletado' });

  }catch(err){
    console.error(err);
    res.status(500).json({ message:'Erro ao deletar' });
  }
});

export default router;
// 