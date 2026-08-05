const express = require('express');
const usuario = require('./controladores/usuarios');
const tarefa = require('./controladores/tarefas');
const validarAutenticacao = require('./intermediarios/autenticacao');

const rotas = express();

rotas.post('/usuarios', usuario.cadastrarUsuario);
rotas.post('/login', usuario.loginUsuario);
rotas.get('/usuarios', usuario.consultarUsuario);

rotas.use(validarAutenticacao);

rotas.post('/tarefas', tarefa.cadastrarTarefa);
rotas.get('/tarefas', tarefa.consultarTarefas);
rotas.get('/tarefas/:id', tarefa.consultarTarefasId);
rotas.put('/tarefas', tarefa.editarTarefas);
rotas.delete('/tarefas/:id', tarefa.excluirTarefas);
rotas.put('/status_tarefas/:id', tarefa.editarStatus );

module.exports = rotas;