const prodModel = require('../models/Product');

// Obtener todos los productos
const getProd = async (req, res) => {
    try {
        const prods = await prodModel.getAllProd();
        res.json(prods);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

// Obtener producto por ID
const getProdById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const product = await prodModel.getProdById(id);
        
        if (!product) {
            return res.status(404).json({ 
                mensaje: 'Producto no encontrado' 
            });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener producto',
            detalles: error.message 
        });
    }
};

// Buscar productos por nombre
const searchProd = async (req, res) => {
    const { nombre } = req.query;
    
    if (!nombre) {
        return res.status(400).json({ 
            mensaje: 'Debes proporcionar un nombre para buscar' 
        });
    }
    
    try {
        const products = await prodModel.getProdByName(nombre);
        res.json(products);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ 
            mensaje: 'Error al buscar productos',
            detalles: error.message 
        });
    }
};

// Crear un nuevo producto
const createProd = async (req, res) => {
    const { nombre, precio, descripcion, categoria, stock, imagePath } = req.body;
    
    if (!nombre || !precio || !categoria) {
        return res.status(400).json({ 
            mensaje: 'Faltan campos requeridos (nombre, precio, categoria)' 
        });
    }
    
    try {
        const precioNum = parseFloat(precio);
        const stockNum = parseInt(stock) || 0;
        
        if (isNaN(precioNum) || precioNum < 0) {
            return res.status(400).json({ 
                mensaje: 'El precio debe ser un número válido mayor o igual a 0' 
            });
        }
        
        const imageUrl = imagePath ? `http://localhost:3000/uploads/${imagePath}` : null;
        
        const productId = await prodModel.createProd(
            nombre, 
            precioNum, 
            descripcion || null, 
            categoria, 
            stockNum, 
            imageUrl
        );
        
        res.status(201).json({ 
            mensaje: 'Producto creado correctamente',
            id: productId,
            producto: {
                id: productId,
                nombre,
                precio: precioNum,
                descripcion,
                categoria,
                stock: stockNum,
                imagen: imageUrl
            }
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ 
            mensaje: 'Error al crear producto',
            detalles: error.message 
        });
    }
};

// Actualizar un producto
const updateProd = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria, stock, imagePath } = req.body;
    
    if (!nombre || !precio || !categoria) {
        return res.status(400).json({ 
            mensaje: 'Faltan campos requeridos (nombre, precio, categoria)' 
        });
    }
    
    try {
        // Verificar si el producto existe
        const existingProduct = await prodModel.getProdById(id);
        if (!existingProduct) {
            return res.status(404).json({ 
                mensaje: 'Producto no encontrado' 
            });
        }
        
        const precioNum = parseFloat(precio);
        const stockNum = parseInt(stock) || 0;
        
        if (isNaN(precioNum) || precioNum < 0) {
            return res.status(400).json({ 
                mensaje: 'El precio debe ser un número válido mayor o igual a 0' 
            });
        }
        
        // Si hay nueva imagen, construir URL; si no, mantener la actual
        const imageUrl = imagePath ? `http://localhost:3000/uploads/${imagePath}` : existingProduct.imagen;
        
        const affectedRows = await prodModel.updateProd(
            id,
            nombre, 
            precioNum, 
            descripcion || null, 
            categoria, 
            stockNum, 
            imageUrl
        );
        
        if (affectedRows === 0) {
            return res.status(404).json({ 
                mensaje: 'No se pudo actualizar el producto' 
            });
        }
        
        res.json({ 
            mensaje: 'Producto actualizado correctamente',
            producto: {
                id,
                nombre,
                precio: precioNum,
                descripcion,
                categoria,
                stock: stockNum,
                imagen: imageUrl
            }
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ 
            mensaje: 'Error al actualizar producto',
            detalles: error.message 
        });
    }
};

// Eliminar un producto
const deleteProd = async (req, res) => {
    const { id } = req.params;
    
    try {
        const affectedRows = await prodModel.deleteProd(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({ 
                mensaje: 'Producto no encontrado' 
            });
        }
        
        res.json({ 
            mensaje: 'Producto eliminado correctamente',
            id: id 
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
            mensaje: 'Error al eliminar producto',
            detalles: error.message 
        });
    }
};

module.exports = {
    getProd,
    getProdById,
    searchProd,
    createProd,
    updateProd,
    deleteProd
};