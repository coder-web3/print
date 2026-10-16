import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '193.203.184.210',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u432536754_giftuser',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u432536754_giftdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 15000
});

export async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('[MySQL Query Error]:', error.message, '| SQL:', sql);
    throw error;
  }
}

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return { ok: true, message: 'Connected to MySQL database successfully' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export default pool;
