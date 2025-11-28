const express = require('express');
const router = express.Router();
const { 
    getProd, 
    getProdById,
    searchProd,
    createProd, 
    updateProd,
    deleteProd 
} = require('../controllers/productsController');

// GET all products
router.get('/', getProd);

// GET search products by name
router.get('/search', searchProd);

// GET product by ID
router.get('/:id', getProdById);

// POST create new product
router.post('/', createProd);

// PUT update product by ID
router.put('/:id', updateProd);

// DELETE product by ID
router.delete('/:id', deleteProd);

module.exports = router;