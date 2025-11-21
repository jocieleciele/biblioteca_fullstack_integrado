import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const db = req.db;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });

    // Verifica se já existe
    const exists = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rowCount > 0)
      return res.status(400).json({ message: "E-mail já cadastrado" });

    // Hash da senha
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1,$2,$3,'Leitor') 
       RETURNING id, name, email, role`,
      [name, email, hashed]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Erro no register:", err);
    res.status(500).json({ message: "Erro interno" });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno" });
  }
};
