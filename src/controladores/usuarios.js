const yup = require('yup');
const {pt} = require('yup-locales');
const conexao = require('../db/conexao');
const { setLocale } = require('yup');

const cadastrarUsuario = async (req, res) => {
    const { nome, email } = req.body

    try {
        setLocale(pt);
        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email('Formato de e-mail é inválido!').required(),
            
        });

        await schema.validate(req.body);

        const existeEmail = 'select * from usuarios where email = $1';

        const { rowCount } = await conexao.query(existeEmail, [email]);

        if(rowCount > 0) {
            return res.status(400).json({mensagem: 'O Email digitado já existe!'});
        }

        const cadUsuario = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';


        const {rows, rowCount:cadastroUsuario} = await conexao.query(cadUsuario, [nome, email]);

        if(cadastroUsuario === 0) {
            return res.status(400).json({mensagem: 'Não foi possível realizar o Cadastro!'})
        }

        const {...usuario} = rows[0];

        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
const consultarUsuario = async (req, res) => {
    
    try {
        

        const { rows, rowCount } = await conexao.query('select * from usuarios');

       
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
    consultarUsuario
}