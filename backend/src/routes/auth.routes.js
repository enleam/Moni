const express = require('express');

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
} = require('../controllers/auth.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);
router.get('/me', verificarToken, obtenerPerfil);

module.exports = router;