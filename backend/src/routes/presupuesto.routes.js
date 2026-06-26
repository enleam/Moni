const express = require('express');

const {
  listarPresupuestos,
  obtenerPresupuesto,
  registrarPresupuesto,
  editarPresupuesto,
  eliminarPresupuesto
} = require('../controllers/presupuesto.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/', listarPresupuestos);
router.get('/:id', obtenerPresupuesto);
router.post('/', registrarPresupuesto);
router.put('/:id', editarPresupuesto);
router.delete('/:id', eliminarPresupuesto);

module.exports = router;