const { Pool } = require('pg');
require('dotenv').config();

const user = process.env.DB_USER;
const host = process.env.DB_LOCALHOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;


const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    user: process.env.DB_USER,
    host: process.env.DB_LOCALHOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const pool = new Pool(config);


const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}
