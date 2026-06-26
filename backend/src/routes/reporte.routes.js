const express = require('express');

const {
  obtenerReporteMensual
} = require('../controllers/reporte.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/mensual', obtenerReporteMensual);

module.exports = router;