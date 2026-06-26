const express = require('express');

const {
  listarCategorias,
  obtenerCategoria,
  registrarCategoria,
  editarCategoria,
  eliminarCategoria
} = require('../controllers/categoria.controller');

const {
  verificarToken
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verificarToken);

router.get('/', listarCategorias);
router.get('/:id', obtenerCategoria);
router.post('/', registrarCategoria);
router.put('/:id', editarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;