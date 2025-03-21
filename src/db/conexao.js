const { Pool } = require('pg');
require('dotenv').config();

const user = process.env.DB_USER;
const host = process.env.DB_LOCALHOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;


const pool = new Pool({
    user,
    host,
    database,
    password,
    port,
    // ssl: {
    //     rejectUnauthorized: false
    // } 

});


const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}
