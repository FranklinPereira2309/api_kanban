const jwt = require('jsonwebtoken');
require('dotenv').config();

const validarAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET || 'senha_secreta_jwt_kanban');
        
        req.usuario = {
            id: tokenDecodificado.id,
            email: tokenDecodificado.email
        };

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
}

module.exports = validarAutenticacao;
