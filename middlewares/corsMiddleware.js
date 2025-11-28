// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const cors = require('cors');

// ===== IPs AUTORIZADAS =====
const ALLOWED_ORIGINS = [
  'https://rythmo-front.vercel.app',  // ← Add your main domain
  'https://rythmo-front-b88gq2mxv-fer-velas-projects.vercel.app',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:57812',
  'http://127.0.0.1:57812',
  'http://localhost:60716',
  'http://127.0.0.1:60716',
  
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list OR matches Vercel pattern
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || 
                     origin.match(/^https:\/\/rythmo-front.*\.vercel\.app$/);
    
    if (isAllowed) {
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