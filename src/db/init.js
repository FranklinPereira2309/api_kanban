const fs = require('fs');
const path = require('path');
const { query } = require('./conexao');

async function criarTabelas() {
    try {
        console.log('Lendo arquivo schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executando query para criar as tabelas...');
        await query(sql);

        console.log('Tabelas criadas com sucesso!');
        process.exit(0);
    } catch (erro) {
        console.error('Erro ao criar as tabelas:', erro);
        process.exit(1);
    }
}

criarTabelas();
