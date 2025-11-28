// ===== DEPENDENCIAS Y CONFIGURACIÓN =====
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const transporter = require('../config/email');

const User = require("../models/User");

const captchaService = require("../services/captchaService");

// ===== FUNCIONES =====
// Función para registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    // Verificar que el email sea válido
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "El correo no es válido" });
    }

    // Verificar que estén llenados todos los campos
    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      country,
    });

    // Recuperar el usuario recién creado
    const user = await User.findByEmail(email);

    // Generar un token JWT
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Usuario registrado con éxito",
      token,
      name: user.name,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// Función para hacer login
exports.login = async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body;

    // Validar captcha
    const captchaResult = await captchaService.validateCaptcha(
      captchaId,
      captchaAnswer
    );
    if (!captchaResult.success) {
      return res.status(400).json({ message: "Captcha incorrecto o expirado" });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la cuenta está bloqueada (temporalemnte --> 5 min)
    if (user.lock_until && new Date() < new Date(user.lock_until)) {
      const now = new Date();
      const unlockDate = new Date(user.lock_until);
      const diffMs = unlockDate - now;
      const diffMin = Math.ceil(diffMs / 60000); // minutos restantes
      return res.status(403).json({
        message: `Cuenta bloqueada. Intenta nuevamente en ${diffMin} minutos.`
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      let failed_attempts = (user.failed_attempts || 0) + 1;
      let lock_until = null;
      const maxAttempts = 3;
      const attemptsLeft = maxAttempts - failed_attempts;

      if (failed_attempts >= maxAttempts) {
        lock_until = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
        await User.updateLoginAttempts(email, failed_attempts, lock_until);
        return res.status(403).json({ message: "Cuenta bloqueada por 5 minutos por intentos fallidos." });
      }

      await User.updateLoginAttempts(email, failed_attempts, lock_until);
      return res.status(400).json({
        message: `Contraseña incorrecta. Te quedan ${attemptsLeft} intento(s) antes del bloqueo.`
      });
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await User.updateLoginAttempts(email, 0, null);
    res.status(200).json({ message: "Login exitoso", token, name: user.name });
    
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Función para enviar código (recuperación de contraseña)
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

  await User.saveResetCode(email, code, expires);

  await transporter.sendMail({
    to: email,
    subject: 'Código de recuperación de Rythmo',
    text: `Tu código es: ${code}`
  });

  res.json({ message: 'Código enviado' });
};

// Función para verificar código (recuperación de contraseña)
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findByEmailAndResetCode(email, code);
  if (!user) {
    return res.status(400).json({ message: 'Código inválido o usuario no encontrado' });
  }
  if (new Date(user.resetCodeExpires) < new Date()) {
    return res.status(400).json({ message: 'El código ha expirado' });
  }
  res.json({ message: 'Código válido' });
};

// Función para resetear contraseña (recuperación de contraseña)
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findByEmailAndResetCode(email, code);
  if (!user) {
    return res.status(400).json({ message: 'Código inválido o usuario no encontrado' });
  }
  if (new Date(user.resetCodeExpires) < new Date()) {
    return res.status(400).json({ message: 'El código ha expirado' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualiza la contraseña y elimina el código de recuperación
  await User.updatePasswordAndClearReset(email, hashedPassword);

  res.json({ message: 'Contraseña actualizada correctamente' });
};
