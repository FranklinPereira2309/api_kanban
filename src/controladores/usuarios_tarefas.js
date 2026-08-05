const conexao = require('../db/conexao');

const cadastrarUsuarioTarefa = async (req, res) => {
    const { nome, email } = req.body;
    const login_id = req.usuario.id; // from token

    if (!nome || !email) {
        return res.status(400).json({ mensagem: 'Nome e email são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO usuarios_tarefas (login_id, nome, email) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await conexao.query(query, [login_id, nome, email]);

        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}` });
    }
};

const consultarUsuariosTarefas = async (req, res) => {
    const login_id = req.usuario.id;

    try {
        const query = 'SELECT * FROM usuarios_tarefas WHERE login_id = $1';
        const { rows } = await conexao.query(query, [login_id]);

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}` });
    }
};

module.exports = {
    cadastrarUsuarioTarefa,
    consultarUsuariosTarefas
};
