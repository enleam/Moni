const express = require('express');

const {
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
} = require('../controllers/perfil.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/', obtenerPerfil);
router.put('/', actualizarPerfil);
router.put('/password', cambiarPassword);

module.exports = router;