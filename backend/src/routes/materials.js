import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// GET /api/materials -> Listar todos os materiais
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM materials ORDER BY titulo ASC"
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error("Erro ao buscar materiais:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
