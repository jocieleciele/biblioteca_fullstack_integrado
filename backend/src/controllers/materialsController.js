import db from "../db/index.js";

// ================================
// GET /materials  (listar tudo)
// ================================
export const getAllMaterials = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM materials ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar materiais:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// GET /materials/:id (detalhes)
// ================================
export const getMaterialById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM materials WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Material não encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar material:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// GET /materials/search?q=
// ================================
export const searchMaterials = async (req, res) => {
  const q = `%${req.query.q || ""}%`;

  try {
    const result = await db.query(
      `
      SELECT *
      FROM materials
      WHERE titulo ILIKE $1
         OR autor ILIKE $1
         OR categoria ILIKE $1
      ORDER BY avaliacao DESC;
      `,
      [q]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar materiais:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// GET /materials/recomendados
// ================================
export const getRecomendados = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM materials ORDER BY avaliacao DESC LIMIT 8"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar recomendados:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// POST /materials
// ================================
export const createMaterial = async (req, res) => {
  const { titulo, autor, categoria, ano, capa, avaliacao, total } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO materials (titulo, autor, categoria, ano, capa, avaliacao, total)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
      `,
      [titulo, autor, categoria, ano, capa, avaliacao, total]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar material:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// PUT /materials/:id
// ================================
export const updateMaterial = async (req, res) => {
  const { titulo, autor, categoria, ano, capa, avaliacao, total } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE materials
      SET titulo=$1, autor=$2, categoria=$3, ano=$4, capa=$5, avaliacao=$6, total=$7
      WHERE id=$8
      RETURNING *;
      `,
      [titulo, autor, categoria, ano, capa, avaliacao, total, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Material não encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar material:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// ================================
// DELETE /materials/:id
// ================================
export const deleteMaterial = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM materials WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ message: "Material removido" });
  } catch (error) {
    console.error("Erro ao deletar material:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
