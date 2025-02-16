const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Banco de dados PostgreSQL conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', error);
    process.exit(1); 
  }
};

module.exports = {
  pool, 
  connectToDatabase, 
};