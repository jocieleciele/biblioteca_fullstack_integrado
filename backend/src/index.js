import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import materialsRoutes from './routes/materials.js';
import emprestimosRoutes from './routes/emprestimos.js';
import reservasRoutes from './routes/reservas.js';
import multasRoutes from './routes/multas.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/emprestimos', emprestimosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/multas', multasRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
