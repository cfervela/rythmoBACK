// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("./middlewares/corsMiddleware");
const pool = require("./config/database"); 

const authRoutes = require("./routes/authRoutes");
const captchaRoutes = require("./routes/captchaRoutes");
const imagenesRoutes = require("./routes/imagenesRoutes");
const usuariosRoutes = require("./routes/usersRoutes");
const productRouter = require("./routes/productRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== RUTA BASE =====
app.get("/", (req, res) => {
  res.send("¡API Rythmos funcionando correctamente!");
});

// ===== RUTAS DE AUTENTICACIÓN ===== 
app.use("/api/auth", authRoutes);

// ===== RUTAS DE CAPTCHA =====
app.use("/api/captcha", captchaRoutes);

// ===== RUTAS DE IMAGENES =====
app.use("/api/images", imagenesRoutes);

// ===== RUTAS DE USUARIOS =====
app.use("/api/usuarios", usuariosRoutes);

// ===== RUTAS DE PRODUCTOS =====
app.use("/api/products", productRouter);

// ===== FUNCIÓN DE PRUEBA COMPLETA BD ===== 
async function testConnection(){
  try{
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log(" Conexión básica establecida. Resultado:", rows[0].result);
    
  } catch (error) {
    console.error(" Error al conectar con la base de datos:");
    console.error("  Mensaje:", error.message);
    console.error("  Código:", error.code);
    console.error("  SQL:", error.sql);
  }
}

// ===== INICIALIZACIÓN DEL SERVIDOR ===== 
app.listen(PORT, async () => {
  console.log(` Servidor escuchando en http://localhost:${PORT}`);
  await testConnection();
});