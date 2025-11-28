// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const cors = require('cors');

// ===== IPs AUTORIZADAS =====
const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:57812',
  'http://127.0.0.1:57812',
  'http://localhost:60716',
  'http://127.0.0.1:60716',
  
];

// ===== CORS MIDDLEWARE =====
const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Not allowed by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
});

// ===== EXPORTACIÓN DE CORS =====
module.exports = corsMiddleware; 