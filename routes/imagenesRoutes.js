const express = require("express");
const router = express.Router();
const imagenesController = require("../controllers/imagenesController");

// Ruta para subir imágenes
router.post("/upload", imagenesController.uploadImages);

// Ruta para eliminar imágenes
router.post("/delete", imagenesController.deleteImages);

module.exports = router;