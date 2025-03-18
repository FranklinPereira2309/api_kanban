const conexao = require('../db/conexao');


const cadastrarTarefa = async (req, res) => {
    const { usuario_id, descricao, setor, prioridade } = req.body

    try {        

        const cadTarefa = 'INSERT INTO tarefas (usuario_id, descricao, setor, prioridade) VALUES ($1, $2, $3, $4) RETURNING *';


        const {rows, rowCount} = await conexao.query(cadTarefa, [usuario_id, descricao, setor, prioridade]);

        if(rowCount === 0) {
            return res.status(400).json({mensagem: 'Não foi possível criar a Tarefa!'})
        }

        const {...tarefa} = rows[0];

        return res.status(200).json(tarefa);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
const consultarTarefas = async (req, res) => {
    
    try {

        const status = {
            afazer: 'a fazer',
            fazendo: 'fazendo',
            pronto: 'pronto'
        }
        
        const tarefaAFazer = `SELECT 
                                tarefas.*,
                                usuarios.nome AS nome_usuario
                                FROM 
                                    tarefas
                                INNER JOIN 
                                    usuarios
                                ON 
                                    tarefas.usuario_id = usuarios.id
                                WHERE 
                                    tarefas.status = $1
                                `;
        const { rows:afazer } = await conexao.query(tarefaAFazer, [status.afazer]);       

                
        const tarefaFazendo = `SELECT 
                                tarefas.*,
                                usuarios.nome AS nome_usuario
                                FROM 
                                    tarefas
                                INNER JOIN 
                                    usuarios
                                ON 
                                    tarefas.usuario_id = usuarios.id
                                WHERE 
                                    tarefas.status = $1
                                `;
        const { rows:fazendo } = await conexao.query(tarefaFazendo, [status.fazendo]);

              
        const tarefaPronto = `SELECT 
                                tarefas.*,
                                usuarios.nome AS nome_usuario
                                FROM 
                                    tarefas
                                INNER JOIN 
                                    usuarios
                                ON 
                                    tarefas.usuario_id = usuarios.id
                                WHERE 
                                    tarefas.status = $1
                                `;
        const { rows:pronto } = await conexao.query(tarefaPronto, [status.pronto]);


        const tarefas = {
            afazer,
            fazendo,
            pronto

        }
        
        return res.status(200).json(tarefas);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const consultarTarefasId = async (req, res) => {
    const  id  = Number(req.params.id);

    try {

        const queryTarefaId = `SELECT 
                                tarefas.*,
                                usuarios.nome AS nome_usuario
                                FROM 
                                    tarefas
                                INNER JOIN 
                                    usuarios
                                ON 
                                    tarefas.usuario_id = usuarios.id
                                WHERE 
                                    tarefas.id = $1
                                `; 
        
        const {rows, rowCount} = await conexao.query(queryTarefaId, [id]);

        if(rowCount === 0) {
            return res.status(404).json({mensagem: 'Dados não encontrados!'});
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const editarTarefas = async (req, res) => {

    const {id, descricao, setor, prioridade } = req.body;

    try {
        const editarTarefa = 'update tarefas set descricao = $1, setor = $2, prioridade = $3 where id = $4';
    
        const { rowCount } =  await conexao.query(editarTarefa, [descricao, setor, prioridade, id]);

        if(rowCount === 0 ) {
            return res.status(400).json({mensagem: 'Não foi possível atualizar os dados!'});
        }

        return res.status(201).json({});
        
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }


}
const excluirTarefas = async (req, res) => {
    const  id  = Number(req.params.id);

    try {
        const excluir = "delete from tarefas where id = $1";
    
        const { rowCount } = await conexao.query(excluir, [id]);
    
        if(rowCount === 0 ) {
            return res.status(400).json({mensagem: 'Não foi possível excluir a tarefa!'});
        }

        return res.status(201).json({});
        
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }


}
const editarStatus = async (req, res) => {

    const { status } = req.body;
    const id = Number(req.params.id);

    try {
        const queryStatus = 'update tarefas set status = $1 where id = $2';
    
        const { rowCount } = await conexao.query(queryStatus, [status, id]); 

        if(rowCount === 0 ) {
            return res.status(400).json({mensagem: 'Não foi possível atualizar o status!'});
        }

        return res.status(201).json({});

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }



}

module.exports = {
    cadastrarTarefa,
    consultarTarefas,
    consultarTarefasId,
    editarTarefas,
    excluirTarefas,
    editarStatus
}