const express = require('express');

const {
  listarMetas,
  obtenerMeta,
  registrarMeta,
  editarMeta,
  registrarAvance,
  desactivarMeta
} = require('../controllers/meta.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/', listarMetas);
router.get('/:id', obtenerMeta);
router.post('/', registrarMeta);
router.put('/:id', editarMeta);
router.patch('/:id/avance', registrarAvance);
router.delete('/:id', desactivarMeta);

module.exports = router;