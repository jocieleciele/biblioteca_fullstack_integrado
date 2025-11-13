import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import materialsRoutes from "./routes/materials.js";
import emprestimosRoutes from "./routes/emprestimos.js";
import pool from "./db/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware para injetar o pool de conexão em cada requisição
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/emprestimos", emprestimosRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log(`Conectado ao PostgreSQL`);
  } catch (err) {
    console.error("Erro ao conectar no banco:", err.message);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});
