const express = require('express');

const {
  listarMovimientos,
  obtenerMovimiento,
  registrarMovimiento,
  editarMovimiento,
  eliminarMovimiento
} = require('../controllers/movimiento.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/', listarMovimientos);
router.get('/:id', obtenerMovimiento);
router.post('/', registrarMovimiento);
router.put('/:id', editarMovimiento);
router.delete('/:id', eliminarMovimiento);

module.exports = router;