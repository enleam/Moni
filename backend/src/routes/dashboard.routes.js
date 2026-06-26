const express = require('express');

const {
  obtenerResumen,
  listarGastosPorCategoria,
  listarIngresosVsGastos,
  listarEvolucionGastos
} = require('../controllers/dashboard.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/resumen', obtenerResumen);
router.get('/gastos-por-categoria', listarGastosPorCategoria);
router.get('/ingresos-vs-gastos', listarIngresosVsGastos);
router.get('/evolucion-gastos', listarEvolucionGastos);

module.exports = router;