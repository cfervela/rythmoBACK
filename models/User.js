// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const pool = require("../config/database");

// ===== OBJETO USER =====
const User = {
    /**
     * Crea un nuevo usuario en la base de datos
     * 
     * @param {Object} userData - Datos del usuario (name, email, password, country)
     * @returns {Promise<number>} - Retorna el ID del usuario creado
     */
    async createUser(userData){
        const {name, email, password, country} = userData;

        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, country) VALUES (?, ?, ?, ?)",
            [name, email, password, country]
        );

        return result.insertId; // Retorna el ID del usuario creado
    },

    /**
     * Busca un usuario por su correo electrónico
     * 
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<Object|null>} - Retorna el usuario si se encuentra, o null si no existe
     */
    async findByEmail(email){
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Hace el conteo de intentos fallidos de login
     */
    async updateLoginAttempts(email, failed_attempts, lock_until) {
        await pool.query(
            "UPDATE users SET failed_attempts = ?, lock_until = ? WHERE email = ?",
            [failed_attempts, lock_until, email]
        );
    },

    /**
     * Guarda el código de recuperación y su expiración
     */
    async saveResetCode(email, code, expires) {
        await pool.query(
            "UPDATE users SET resetCode = ?, resetCodeExpires = ? WHERE email = ?",
            [code, expires, email]
        );
    },

    /**
     * Busca usuario por email y código de recuperación
     */
    async findByEmailAndResetCode(email, code) {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? AND resetCode = ?",
            [email, code]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Actualiza la contraseña y borra el código de recuperación
     */
    async updatePasswordAndClearReset(email, hashedPassword) {
        await pool.query(
            "UPDATE users SET password = ?, resetCode = NULL, resetCodeExpires = NULL WHERE email = ?",
            [hashedPassword, email]
        );
    }
};

async function getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

// ===== EXPORTACIÓN DEL MODELO =====
module.exports = {
    User,
    getAllUsers
};
