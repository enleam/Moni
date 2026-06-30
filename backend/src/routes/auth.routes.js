const express = require('express');

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  solicitarRecuperacionPassword,
  restablecerPassword,
  verificarEmail
} = require('../controllers/auth.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/forgot-password', solicitarRecuperacionPassword);
router.post('/reset-password', restablecerPassword);
router.get('/verify-email/:token', verificarEmail);
router.get('/me', verificarToken, obtenerPerfil);

module.exports = router;