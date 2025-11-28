const pool = require("../config/database");

async function getAllProd() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
}

async function getProdById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
}

async function getProdByName(nombre) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE nombre LIKE ?', [`%${nombre}%`]);
    return rows;
}

async function createProd(nombre, precio, descripcion, categoria, stock, imagen) {
    const [result] = await pool.query(
        'INSERT INTO productos (nombre, precio, descripcion, categoria, stock, imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, precio, descripcion, categoria, stock, imagen]
    );
    return result.insertId;
}

async function updateProd(id, nombre, precio, descripcion, categoria, stock, imagen) {
    // Si no se proporciona una nueva imagen, mantener la actual
    let query = 'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, categoria = ?, stock = ?';
    let params = [nombre, precio, descripcion, categoria, stock];
    
    if (imagen) {
        query += ', imagen = ?';
        params.push(imagen);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

async function deleteProd(id) {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    getAllProd,
    getProdById,
    getProdByName,
    createProd,
    updateProd,
    deleteProd
};