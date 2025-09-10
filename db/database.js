const mysql = require('mysql2/primise');
require('dotenv').config(); // caso a gente queira usar variaveis de ambiente

// configuração do Banco de Dados
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    host: process.env.DB_USER || 'root',
    host: process.env.DB_PASSWORD || 'localhost',
    host: process.env.DB_NAME || 'prj_api_users'
});

// importação direto do arquivo BD.
module.exports = db;