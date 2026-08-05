const yup = require('yup');
const {pt} = require('yup-locales');
const conexao = require('../db/conexao');
const { setLocale } = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        setLocale(pt);
        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email('Formato de e-mail é inválido!').required(),
            senha: yup.string().required('A senha é obrigatória')
        });

        await schema.validate(req.body);

        const existeEmail = 'select * from usuarios where email = $1';

        const { rowCount } = await conexao.query(existeEmail, [email]);

        if(rowCount > 0) {
            return res.status(400).json({mensagem: 'O Email digitado já existe!'});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadUsuario = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';

        const {rows, rowCount:cadastroUsuario} = await conexao.query(cadUsuario, [nome, email, senhaCriptografada]);

        if(cadastroUsuario === 0) {
            return res.status(400).json({mensagem: 'Não foi possível realizar o Cadastro!'})
        }

        const usuario = rows[0];

        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios!' });
    }

    try {
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await conexao.query(queryVerificaEmail, [email]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Email e/ou senha inválido(s)' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'senha_secreta_jwt_kanban', { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario;

        return res.status(200).json({ usuario: usuarioLogado, token });
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}` });
    }
}

const consultarUsuario = async (req, res) => {
    try {
        const { rows, rowCount } = await conexao.query('select id, nome, email from usuarios');
       
        if(rowCount === 0) {
            return res.status(400).json({mensagem: 'Dados não encontrados!'})
        }

        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    consultarUsuario
}