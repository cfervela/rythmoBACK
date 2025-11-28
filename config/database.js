const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 11550, // ¡IMPORTANTE! Agregaste el puerto
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000, // 20 segundos (importante para conexiones remotas)
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
    });

module.exports = pool;