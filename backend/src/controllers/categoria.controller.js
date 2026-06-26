const {
  listarCategoriasPorUsuario,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  desactivarCategoria
} = require('../models/categoria.model');

const validarTipoCategoria = (tipo) => {
  return ['INGRESO', 'GASTO'].includes(tipo);
};

const listarCategorias = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const categorias = await listarCategoriasPorUsuario(usuario_id);

    return res.status(200).json({
      mensaje: 'Categorías obtenidas correctamente.',
      categorias
    });

  } catch (error) {
    console.error('Error al listar categorías:', error);

    return res.status(500).json({
      mensaje: 'Error interno al listar categorías.'
    });
  }
};

const obtenerCategoria = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const categoria_id = Number(req.params.id);

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: 'ID de categoría inválido.'
      });
    }

    const categoria = await obtenerCategoriaPorId(
      categoria_id,
      usuario_id
    );

    if (!categoria) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada.'
      });
    }

    return res.status(200).json({
      mensaje: 'Categoría obtenida correctamente.',
      categoria
    });

  } catch (error) {
    console.error('Error al obtener categoría:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener categoría.'
    });
  }
};

const registrarCategoria = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { nombre, tipo, color } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({
        mensaje: 'Nombre y tipo son obligatorios.'
      });
    }

    const tipoNormalizado = tipo.toUpperCase();

    if (!validarTipoCategoria(tipoNormalizado)) {
      return res.status(400).json({
        mensaje: 'El tipo debe ser INGRESO o GASTO.'
      });
    }

    const nuevaCategoria = await crearCategoria({
      usuario_id,
      nombre: nombre.trim(),
      tipo: tipoNormalizado,
      color
    });

    return res.status(201).json({
      mensaje: 'Categoría registrada correctamente.',
      categoria: nuevaCategoria
    });

  } catch (error) {
    console.error('Error al registrar categoría:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar categoría.'
    });
  }
};

const editarCategoria = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const categoria_id = Number(req.params.id);
    const { nombre, tipo, color } = req.body;

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: 'ID de categoría inválido.'
      });
    }

    if (!nombre || !tipo) {
      return res.status(400).json({
        mensaje: 'Nombre y tipo son obligatorios.'
      });
    }

    const tipoNormalizado = tipo.toUpperCase();

    if (!validarTipoCategoria(tipoNormalizado)) {
      return res.status(400).json({
        mensaje: 'El tipo debe ser INGRESO o GASTO.'
      });
    }

    const categoriaActualizada = await actualizarCategoria({
      categoria_id,
      usuario_id,
      nombre: nombre.trim(),
      tipo: tipoNormalizado,
      color
    });

    if (!categoriaActualizada) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Categoría actualizada correctamente.',
      categoria: categoriaActualizada
    });

  } catch (error) {
    console.error('Error al editar categoría:', error);

    return res.status(500).json({
      mensaje: 'Error interno al editar categoría.'
    });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const categoria_id = Number(req.params.id);

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: 'ID de categoría inválido.'
      });
    }

    const categoriaEliminada = await desactivarCategoria(
      categoria_id,
      usuario_id
    );

    if (!categoriaEliminada) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Categoría desactivada correctamente.',
      categoria: categoriaEliminada
    });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);

    return res.status(500).json({
      mensaje: 'Error interno al eliminar categoría.'
    });
  }
};

module.exports = {
  listarCategorias,
  obtenerCategoria,
  registrarCategoria,
  editarCategoria,
  eliminarCategoria
};