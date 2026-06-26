const {
  listarMovimientosPorUsuario,
  obtenerMovimientoPorId,
  obtenerCategoriaValida,
  crearMovimiento,
  actualizarMovimiento,
  desactivarMovimiento
} = require('../models/movimiento.model');

const validarTipoMovimiento = (tipo) => {
  return ['INGRESO', 'GASTO'].includes(tipo);
};

const listarMovimientos = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const movimientos = await listarMovimientosPorUsuario(usuario_id);

    return res.status(200).json({
      mensaje: 'Movimientos obtenidos correctamente.',
      movimientos
    });

  } catch (error) {
    console.error('Error al listar movimientos:', error);

    return res.status(500).json({
      mensaje: 'Error interno al listar movimientos.'
    });
  }
};

const obtenerMovimiento = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const movimiento_id = Number(req.params.id);

    if (!movimiento_id) {
      return res.status(400).json({
        mensaje: 'ID de movimiento inválido.'
      });
    }

    const movimiento = await obtenerMovimientoPorId(
      movimiento_id,
      usuario_id
    );

    if (!movimiento) {
      return res.status(404).json({
        mensaje: 'Movimiento no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Movimiento obtenido correctamente.',
      movimiento
    });

  } catch (error) {
    console.error('Error al obtener movimiento:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener movimiento.'
    });
  }
};

const registrarMovimiento = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const {
      categoria_id,
      tipo,
      monto,
      fecha,
      descripcion,
      metodo_pago
    } = req.body;

    if (!categoria_id || !tipo || !monto || !fecha) {
      return res.status(400).json({
        mensaje: 'Categoría, tipo, monto y fecha son obligatorios.'
      });
    }

    const tipoNormalizado = tipo.toUpperCase();
    const montoNumero = Number(monto);

    if (!validarTipoMovimiento(tipoNormalizado)) {
      return res.status(400).json({
        mensaje: 'El tipo debe ser INGRESO o GASTO.'
      });
    }

    if (montoNumero <= 0) {
      return res.status(400).json({
        mensaje: 'El monto debe ser mayor a cero.'
      });
    }

    const categoriaValida = await obtenerCategoriaValida({
      categoria_id: Number(categoria_id),
      usuario_id,
      tipo: tipoNormalizado
    });

    if (!categoriaValida) {
      return res.status(400).json({
        mensaje: 'La categoría no existe, no pertenece al usuario o no coincide con el tipo.'
      });
    }

    const nuevoMovimiento = await crearMovimiento({
      usuario_id,
      categoria_id: Number(categoria_id),
      tipo: tipoNormalizado,
      monto: montoNumero,
      fecha,
      descripcion,
      metodo_pago
    });

    return res.status(201).json({
      mensaje: 'Movimiento registrado correctamente.',
      movimiento: nuevoMovimiento
    });

  } catch (error) {
    console.error('Error al registrar movimiento:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar movimiento.'
    });
  }
};

const editarMovimiento = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const movimiento_id = Number(req.params.id);

    const {
      categoria_id,
      tipo,
      monto,
      fecha,
      descripcion,
      metodo_pago
    } = req.body;

    if (!movimiento_id) {
      return res.status(400).json({
        mensaje: 'ID de movimiento inválido.'
      });
    }

    if (!categoria_id || !tipo || !monto || !fecha) {
      return res.status(400).json({
        mensaje: 'Categoría, tipo, monto y fecha son obligatorios.'
      });
    }

    const tipoNormalizado = tipo.toUpperCase();
    const montoNumero = Number(monto);

    if (!validarTipoMovimiento(tipoNormalizado)) {
      return res.status(400).json({
        mensaje: 'El tipo debe ser INGRESO o GASTO.'
      });
    }

    if (montoNumero <= 0) {
      return res.status(400).json({
        mensaje: 'El monto debe ser mayor a cero.'
      });
    }

    const categoriaValida = await obtenerCategoriaValida({
      categoria_id: Number(categoria_id),
      usuario_id,
      tipo: tipoNormalizado
    });

    if (!categoriaValida) {
      return res.status(400).json({
        mensaje: 'La categoría no existe, no pertenece al usuario o no coincide con el tipo.'
      });
    }

    const movimientoActualizado = await actualizarMovimiento({
      movimiento_id,
      usuario_id,
      categoria_id: Number(categoria_id),
      tipo: tipoNormalizado,
      monto: montoNumero,
      fecha,
      descripcion,
      metodo_pago
    });

    if (!movimientoActualizado) {
      return res.status(404).json({
        mensaje: 'Movimiento no encontrado o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Movimiento actualizado correctamente.',
      movimiento: movimientoActualizado
    });

  } catch (error) {
    console.error('Error al editar movimiento:', error);

    return res.status(500).json({
      mensaje: 'Error interno al editar movimiento.'
    });
  }
};

const eliminarMovimiento = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const movimiento_id = Number(req.params.id);

    if (!movimiento_id) {
      return res.status(400).json({
        mensaje: 'ID de movimiento inválido.'
      });
    }

    const movimientoEliminado = await desactivarMovimiento(
      movimiento_id,
      usuario_id
    );

    if (!movimientoEliminado) {
      return res.status(404).json({
        mensaje: 'Movimiento no encontrado o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Movimiento eliminado correctamente.',
      movimiento: movimientoEliminado
    });

  } catch (error) {
    console.error('Error al eliminar movimiento:', error);

    return res.status(500).json({
      mensaje: 'Error interno al eliminar movimiento.'
    });
  }
};

module.exports = {
  listarMovimientos,
  obtenerMovimiento,
  registrarMovimiento,
  editarMovimiento,
  eliminarMovimiento
};