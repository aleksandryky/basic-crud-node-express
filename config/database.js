const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'basic_crud_app',
  waitForConnections: true,
  connectionLimit: 10,
});

/**
 * Quick connectivity check on app startup.
 */
async function initDatabase() {
  const conn = await pool.getConnection();
  conn.release();
  console.log('Database connected');
}

module.exports = { pool, initDatabase };
