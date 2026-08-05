CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE usuarios_tarefas (
    id SERIAL PRIMARY KEY,
    login_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    login_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_id INT REFERENCES usuarios_tarefas(id) ON DELETE SET NULL,
    descricao TEXT,
    setor VARCHAR(100),
    prioridade VARCHAR(15) NOT NULL CHECK (prioridade IN ('baixa', 'média', 'alta')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(15) NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer', 'fazendo', 'pronto'))
);
