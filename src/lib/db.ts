import mysql from 'mysql2/promise';

/**
 * Configuration de la base de données Akwaba Info
 * Valeurs identiques au fichier config.php
 */
const db_host = 'localhost';
const db_name = 'akwaba_info';
const db_user = 'root';
const db_pass = '';

const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_pass,
  database: db_name,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
