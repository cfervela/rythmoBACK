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
const allowedOrigins = [
    'https://rythmo-front-b88gq2mxv-fer-velas-projects.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman, curl, apps móviles)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Origen bloqueado por CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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