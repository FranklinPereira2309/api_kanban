require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Starting migration...");
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios_tarefas (
                id SERIAL PRIMARY KEY,
                login_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL
            );
        `);
        console.log("Created usuarios_tarefas table.");

        await pool.query(`
            ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS login_id INT;
        `);
        console.log("Added login_id to tarefas.");
        
        // Since we are changing the foreign key, existing tasks will have a usuario_id that refers to the old usuarios table.
        // It's best to set them to NULL to avoid constraint errors, and set the new login_id equal to the old usuario_id (which was the login user)
        await pool.query(`
            UPDATE tarefas SET login_id = usuario_id WHERE login_id IS NULL;
        `);
        
        await pool.query(`
            ALTER TABLE tarefas DROP CONSTRAINT IF EXISTS tarefas_usuario_id_fkey;
        `);
        console.log("Dropped old FK.");
        
        // Temporarily nullify usuario_id so we can add the new FK without violating constraint
        await pool.query(`
            UPDATE tarefas SET usuario_id = NULL;
        `);
        
        await pool.query(`
            ALTER TABLE tarefas ADD CONSTRAINT tarefas_login_id_fkey FOREIGN KEY (login_id) REFERENCES usuarios(id) ON DELETE CASCADE;
        `);
        console.log("Added login_id FK.");

        await pool.query(`
            ALTER TABLE tarefas ADD CONSTRAINT tarefas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios_tarefas(id) ON DELETE SET NULL;
        `);
        console.log("Added new usuario_id FK.");
        
        console.log("Migration complete!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();
