import express from "express";
import { verifyToken } from "./verify.js";

const router = express.Router();

// POST /api/reservas -> Criar uma nova reserva
router.post("/", verifyToken, async (req, res) => {
  const { material_id } = req.body;
  const usuario_id = req.user.id;
  const db = req.db;

  if (!material_id) {
    return res.status(400).json({ message: "ID do material é obrigatório" });
  }

  try {
    // Opcional: Verificar se o material já está disponível ou se o usuário já tem uma reserva/empréstimo ativo para ele.
    // Por simplicidade, vamos apenas inserir a reserva.
    const dbRes = await db.query(
      "INSERT INTO reservas (usuario_id, material_id) VALUES ($1, $2) RETURNING *",
      [usuario_id, material_id]
    );
    res.status(201).json({ item: dbRes.rows[0] });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// GET /api/reservas -> Listar TODAS as reservas pendentes (Admin/Bibliotecário)
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role === "Leitor") {
    return res.status(403).json({ message: "Não autorizado" });
  }

  const db = req.db;
  try {
    const result = await db.query(
      `SELECT r.*, u.name as usuario_name, m.titulo as material_titulo 
       FROM reservas r 
       JOIN users u ON u.id = r.usuario_id 
       JOIN materials m ON m.id = r.material_id 
       WHERE r.status = 'Pendente' 
       ORDER BY r.data_reserva ASC`
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error("Erro ao buscar todas as reservas:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// GET /api/reservas/user/:id -> Listar reservas de um usuário
router.get("/user/:id", verifyToken, async (req, res) => {
  const usuario_id = parseInt(req.params.id, 10);

  // Garante que um usuário só pode ver suas próprias reservas
  if (req.user.id !== usuario_id && req.user.role === "Leitor") {
    return res.status(403).json({ message: "Não autorizado" });
  }

  const db = req.db;
  try {
    const result = await db.query(
      `SELECT r.*, m.titulo as material_titulo FROM reservas r JOIN materials m ON m.id = r.material_id WHERE r.usuario_id = $1 AND r.status = 'Pendente' ORDER BY r.data_reserva ASC`,
      [usuario_id]
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// PUT /api/reservas/:id/atender -> Converte uma reserva em empréstimo (Admin/Bibliotecário)
router.put("/:id/atender", verifyToken, async (req, res) => {
  if (req.user.role === "Leitor") {
    return res.status(403).json({ message: "Não autorizado" });
  }

  const reserva_id = parseInt(req.params.id, 10);
  const db = req.db;

  try {
    // 1. Pega os dados da reserva
    const reservaResult = await db.query(
      "SELECT * FROM reservas WHERE id = $1 AND status = 'Pendente'",
      [reserva_id]
    );
    if (reservaResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Reserva não encontrada ou já atendida" });
    }
    const reserva = reservaResult.rows[0];

    // 2. Cria um novo empréstimo
    const data_prevista = new Date();
    data_prevista.setDate(data_prevista.getDate() + 14); // Empréstimo de 14 dias
    await db.query(
      "INSERT INTO emprestimos (usuario_id, material_id, data_prevista) VALUES ($1, $2, $3)",
      [reserva.usuario_id, reserva.material_id, data_prevista]
    );

    // 3. Atualiza o status da reserva para 'Atendida'
    const updatedReserva = await db.query(
      "UPDATE reservas SET status = 'Atendida' WHERE id = $1 RETURNING *",
      [reserva_id]
    );

    res.json({
      message: "Reserva atendida com sucesso!",
      item: updatedReserva.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atender reserva:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// PUT /api/reservas/:id/cancelar -> Cancela uma reserva (Admin/Bibliotecário)
router.put("/:id/cancelar", verifyToken, async (req, res) => {
  if (req.user.role === "Leitor") {
    return res.status(403).json({ message: "Não autorizado" });
  }
  const reserva_id = parseInt(req.params.id, 10);
  const db = req.db;
  try {
    const updatedReserva = await db.query(
      "UPDATE reservas SET status = 'Cancelada' WHERE id = $1 RETURNING *",
      [reserva_id]
    );
    res.json({
      message: "Reserva cancelada com sucesso!",
      item: updatedReserva.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
