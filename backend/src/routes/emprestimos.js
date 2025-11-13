// backend/src/routes/emprestimos.js
import express from "express";
import { verifyToken } from "./verify.js"; // middleware JWT já criado
const router = express.Router();

// util: calcula se atrasado
function isAtrasado(row) {
  if (row.data_devolucao) return false;
  if (!row.data_prevista) return false;
  const prevista = new Date(row.data_prevista);
  const hoje = new Date();
  return prevista < hoje;
}

// GET /api/emprestimos/user/:id  -> empréstimos de um usuário
router.get("/user/:id", verifyToken, async (req, res) => {
  const db = req.db;
  const uid = parseInt(req.params.id, 10);
  // autorização: usuário pode ver seus próprios ou bibliotecário/admin vêem qualquer
  if (req.user.id !== uid && req.user.role === "Leitor") {
    return res.status(403).json({ error: "não autorizado" });
  }
  try {
    const r = await db.query(
      `SELECT e.*, m.titulo AS material_titulo, m.autor AS material_autor, m.capa AS material_capa
       FROM emprestimos e
       JOIN materials m ON m.id = e.material_id
       WHERE e.usuario_id = $1
       ORDER BY e.data_emprestimo DESC`,
      [uid]
    );
    const items = r.rows.map((row) => ({
      ...row,
      atrasado: isAtrasado(row),
    }));
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// GET /api/emprestimos/atrasados  -> todos os atrasados (bibliotecário/admin)
router.get("/atrasados", verifyToken, async (req, res) => {
  if (req.user.role === "Leitor")
    return res.status(403).json({ error: "não autorizado" });
  const db = req.db;
  try {
    const r = await db.query(
      `SELECT e.*, u.name as usuario_name, m.titulo as material_titulo, m.autor as material_autor
       FROM emprestimos e
       JOIN users u ON u.id = e.usuario_id
       JOIN materials m ON m.id = e.material_id
       WHERE e.data_devolucao IS NULL AND e.data_prevista < CURRENT_DATE
       ORDER BY e.data_prevista ASC`
    );
    res.json({ items: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// GET /api/emprestimos  -> list all (protected: bibliotecario/admin)
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role === "Leitor")
    return res.status(403).json({ error: "não autorizado" });
  const db = req.db;
  try {
    const r = await db.query(
      `SELECT e.*, u.name as usuario_name, m.titulo as material_titulo, m.autor as material_autor
       FROM emprestimos e
       JOIN users u ON u.id = e.usuario_id
       JOIN materials m ON m.id = e.material_id
       ORDER BY e.data_emprestimo DESC`
    );
    res.json({ items: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// POST /api/emprestimos  -> criar empréstimo (protected)
router.post("/", verifyToken, async (req, res) => {
  const { material_id } = req.body;
  const { id: requisitante_id, role: requisitante_role } = req.user;

  // Um leitor só pode solicitar para si mesmo.
  const usuario_id = requisitante_id;

  // Define a data de devolução para 14 dias a partir de hoje
  const data_prevista = new Date();
  data_prevista.setDate(data_prevista.getDate() + 14);

  if (!material_id) {
    return res.status(400).json({ message: "ID do material é obrigatório" });
  }
  const db = req.db;
  try {
    const r = await db.query(
      `INSERT INTO emprestimos (usuario_id, material_id, data_prevista) VALUES ($1,$2,$3) RETURNING *`,
      [usuario_id, material_id, data_prevista]
    );
    res.status(201).json({ item: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// PUT /api/emprestimos/:id/devolver  -> marcar devolução (protected)
router.put("/:id/devolver", verifyToken, async (req, res) => {
  // bibliotecário/admin ou dono pode marcar devolução
  const db = req.db;
  const id = parseInt(req.params.id, 10);
  try {
    // read first
    const r0 = await db.query("SELECT * FROM emprestimos WHERE id=$1", [id]);
    if (r0.rowCount === 0)
      return res.status(404).json({ error: "não encontrado" });
    const emp = r0.rows[0];
    if (req.user.role === "Leitor" && req.user.id !== emp.usuario_id) {
      return res.status(403).json({ error: "não autorizado" });
    }
    const r = await db.query(
      `UPDATE emprestimos SET data_devolucao = CURRENT_DATE, status='Concluído' WHERE id=$1 RETURNING *`,
      [id]
    );
    // opcional: incrementar avaliacao em materials
    await db.query(
      "UPDATE materials SET avaliacao = GREATEST(0, avaliacao + 1) WHERE id=$1",
      [emp.material_id]
    );
    res.json({ item: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

export default router;
