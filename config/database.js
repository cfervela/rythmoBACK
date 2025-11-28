const mysql = require('mysql2/promise');

// ✓ ADD THIS DEBUG CODE
console.log('=== DATABASE CONFIGURATION ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
console.log('==============================');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 11550,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000,
    acquireTimeout: 20000,
    timeout: 20000
});

// Verificar conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log('✓ Conexión exitosa a la base de datos');
        connection.release();
    })
    .catch(err => {
        console.error('✗ Error conectando a la base de datos:', err.message);
        console.error('✗ Error completo:', err);
    });

module.exports = pool;
