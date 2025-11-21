-- ===============================
--   BANCO DE DADOS SG_BIBLIOTECA
-- ===============================

-- CRIA TABELAS
-- ============
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Leitor'
);

-- Tabela de Materiais
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    ano INTEGER,
    capa VARCHAR(255),
    avaliacao INTEGER DEFAULT 0,
    total INTEGER DEFAULT 1,
    descricao TEXT,
    disponiveis INTEGER DEFAULT 1
);

-- Tabela de Empréstimos
CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    data_emprestimo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Pendente'
);

-- Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    data_reserva TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pendente'
);

-- ===============================
-- INSERIR MATERIAIS (19 registros)
-- ===============================

INSERT INTO materials (titulo, autor, categoria, ano, capa, avaliacao, total, descricao)
VALUES
('Coroa dos Justos', 'Morgan Rice', 'Ficção', 2025, 'img1', 4, 2, ''),
('Canção dos Valentes', 'Morgan Rice', 'Ficção', 2025, 'img2', 5, 1, ''),
('A Arte da Guerra', 'Sun Tzu', 'Ação', 2009, 'img3', 3, 5, ''),
('O Encantador de Corvos', 'Jacob Grey', 'Ficção', 2017, 'img4', 2, 2, ''),
('O Nome do Vento', 'Patrick Rothfuss', 'Fantasia', 2007, 'img5', 5, 3, ''),
('O Temor do Sábio', 'Patrick Rothfuss', 'Fantasia', 2011, 'img6', 5, 3, ''),
('O Senhor dos Anéis – A Sociedade do Anel', 'J.R.R. Tolkien', 'Fantasia', 1954, 'img7', 5, 4, ''),
('O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 1937, 'img8', 5, 4, ''),
('Duna', 'Frank Herbert', 'Ficção Científica', 1965, 'img9', 5, 4, ''),
('Neuromancer', 'William Gibson', 'Ficção Científica', 1984, 'img10', 4, 3, ''),
('A Garota no Trem', 'Paula Hawkins', 'Suspense', 2015, 'img11', 4, 2, ''),
('O Código Da Vinci', 'Dan Brown', 'Suspense', 2003, 'img12', 5, 3, ''),
('1984', 'George Orwell', 'Ficção', 1949, 'img13', 5, 5, ''),
('Admirável Mundo Novo', 'Aldous Huxley', 'Ficção', 1932, 'img14', 4, 4, ''),
('O Velho e o Mar', 'Ernest Hemingway', 'Clássico', 1952, 'img15', 5, 2, ''),
('Coroa dos Justos', 'Morgan Rice', 'Ficção', 2025, 'img1', 4, 2, ''),
('Canção dos Valentes', 'Morgan Rice', 'Ficção', 2025, 'img2', 5, 1, ''),
('A Arte da Guerra', 'Sun Tzu', 'Ação', 2009, 'img3', 3, 5, ''),
('O Encantador de Corvos', 'Jacob Grey', 'Ficção', 2017, 'img4', 2, 2, '');

-- ================================
-- ATUALIZAR DISPONÍVEIS = TOTAL
-- ================================
UPDATE materials SET disponiveis = total;

