-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Leitor' -- Ex: Leitor, Bibliotecário, Administrador
);

-- Tabela de Materiais (Livros, etc.)
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    categoria VARCHAR(100),
    ano INTEGER,
    capa VARCHAR(255), -- Pode ser um link para a imagem da capa
    avaliacao INTEGER DEFAULT 0,
    total INTEGER DEFAULT 1 -- Quantidade total de cópias
);

-- Tabela de Empréstimos
CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES users(id),
    material_id INTEGER NOT NULL REFERENCES materials(id),
    data_emprestimo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_prevista TIMESTAMP WITH TIME ZONE,
    data_devolucao TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Em andamento' -- Ex: Em andamento, Concluído, Atrasado
);

-- Tabela de Reservas
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES users(id),
  material_id INTEGER NOT NULL REFERENCES materials(id),
  data_reserva TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pendente' -- Ex: Pendente, Atendida, Cancelada
);

-- Opcional: Inserir alguns dados de exemplo para testar
INSERT INTO materials (titulo, autor, categoria, ano, capa, avaliacao, total) VALUES
('Coroa dos Justos', 'Morgan Rice', 'Ficção', 2025, 'img1', 4, 2),
('Canção dos Valentes', 'Morgan Rice', 'Ficção', 2025, 'img2', 5, 1),
('A Arte da Guerra', 'Sun Tzu', 'Ação', 2009, 'img3', 3, 5),
('O Encantador de Corvos', 'Jacob Grey', 'Ficção', 2017, 'img4', 2, 2);

