const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'web3user',
  password: process.env.DB_PASSWORD || 'web3password',
  database: process.env.DB_NAME || 'web3security',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[DB] MySQL connection established.');
    conn.release();
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    setTimeout(testConnection, 5000);
  }
}

testConnection();

module.exports = pool;
