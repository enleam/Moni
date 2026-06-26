const {
  listarPresupuestosPorUsuario,
  obtenerPresupuestoPorId,
  obtenerCategoriaGastoValida,
  buscarPresupuestoExistente,
  crearPresupuesto,
  actualizarPresupuesto,
  desactivarPresupuesto
} = require('../models/presupuesto.model');

const obtenerPeriodo = (req) => {
  const fechaActual = new Date();

  const anio = req.query.anio
    ? Number(req.query.anio)
    : fechaActual.getFullYear();

  const mes = req.query.mes
    ? Number(req.query.mes)
    : fechaActual.getMonth() + 1;

  return { anio, mes };
};

const validarPeriodo = (anio, mes) => {
  return (
    Number.isInteger(anio) &&
    Number.isInteger(mes) &&
    anio >= 2000 &&
    mes >= 1 &&
    mes <= 12
  );
};

const listarPresupuestos = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    const presupuestos = await listarPresupuestosPorUsuario({
      usuario_id,
      anio,
      mes
    });

    return res.status(200).json({
      mensaje: 'Presupuestos obtenidos correctamente.',
      periodo: { anio, mes },
      presupuestos
    });

  } catch (error) {
    console.error('Error al listar presupuestos:', error);

    return res.status(500).json({
      mensaje: 'Error interno al listar presupuestos.'
    });
  }
};

const obtenerPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const presupuesto_id = Number(req.params.id);

    if (!presupuesto_id) {
      return res.status(400).json({
        mensaje: 'ID de presupuesto inválido.'
      });
    }

    const presupuesto = await obtenerPresupuestoPorId(
      presupuesto_id,
      usuario_id
    );

    if (!presupuesto) {
      return res.status(404).json({
        mensaje: 'Presupuesto no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Presupuesto obtenido correctamente.',
      presupuesto
    });

  } catch (error) {
    console.error('Error al obtener presupuesto:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener presupuesto.'
    });
  }
};

const registrarPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const {
      categoria_id,
      anio,
      mes,
      monto_presupuestado
    } = req.body;

    if (!categoria_id || !anio || !mes || !monto_presupuestado) {
      return res.status(400).json({
        mensaje: 'Categoría, año, mes y monto presupuestado son obligatorios.'
      });
    }

    const categoriaIdNumero = Number(categoria_id);
    const anioNumero = Number(anio);
    const mesNumero = Number(mes);
    const montoNumero = Number(monto_presupuestado);

    if (!validarPeriodo(anioNumero, mesNumero)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    if (montoNumero <= 0) {
      return res.status(400).json({
        mensaje: 'El monto presupuestado debe ser mayor a cero.'
      });
    }

    const categoriaValida = await obtenerCategoriaGastoValida(
      categoriaIdNumero,
      usuario_id
    );

    if (!categoriaValida) {
      return res.status(400).json({
        mensaje: 'La categoría no existe, no pertenece al usuario o no es de tipo GASTO.'
      });
    }

    const presupuestoExistente = await buscarPresupuestoExistente({
      usuario_id,
      categoria_id: categoriaIdNumero,
      anio: anioNumero,
      mes: mesNumero
    });

    if (presupuestoExistente && presupuestoExistente.activo) {
      return res.status(409).json({
        mensaje: 'Ya existe un presupuesto activo para esta categoría en ese periodo.'
      });
    }

    if (presupuestoExistente && !presupuestoExistente.activo) {
      return res.status(409).json({
        mensaje: 'Ya existe un presupuesto eliminado para esta categoría y periodo. Edita el registro en SQL o usa otra categoría.'
      });
    }

    const nuevoPresupuesto = await crearPresupuesto({
      usuario_id,
      categoria_id: categoriaIdNumero,
      anio: anioNumero,
      mes: mesNumero,
      monto_presupuestado: montoNumero
    });

    return res.status(201).json({
      mensaje: 'Presupuesto registrado correctamente.',
      presupuesto: nuevoPresupuesto
    });

  } catch (error) {
    console.error('Error al registrar presupuesto:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar presupuesto.'
    });
  }
};

const editarPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const presupuesto_id = Number(req.params.id);

    const {
      categoria_id,
      anio,
      mes,
      monto_presupuestado
    } = req.body;

    if (!presupuesto_id) {
      return res.status(400).json({
        mensaje: 'ID de presupuesto inválido.'
      });
    }

    if (!categoria_id || !anio || !mes || !monto_presupuestado) {
      return res.status(400).json({
        mensaje: 'Categoría, año, mes y monto presupuestado son obligatorios.'
      });
    }

    const categoriaIdNumero = Number(categoria_id);
    const anioNumero = Number(anio);
    const mesNumero = Number(mes);
    const montoNumero = Number(monto_presupuestado);

    if (!validarPeriodo(anioNumero, mesNumero)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    if (montoNumero <= 0) {
      return res.status(400).json({
        mensaje: 'El monto presupuestado debe ser mayor a cero.'
      });
    }

    const categoriaValida = await obtenerCategoriaGastoValida(
      categoriaIdNumero,
      usuario_id
    );

    if (!categoriaValida) {
      return res.status(400).json({
        mensaje: 'La categoría no existe, no pertenece al usuario o no es de tipo GASTO.'
      });
    }

    const presupuestoActualizado = await actualizarPresupuesto({
      presupuesto_id,
      usuario_id,
      categoria_id: categoriaIdNumero,
      anio: anioNumero,
      mes: mesNumero,
      monto_presupuestado: montoNumero
    });

    if (!presupuestoActualizado) {
      return res.status(404).json({
        mensaje: 'Presupuesto no encontrado o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Presupuesto actualizado correctamente.',
      presupuesto: presupuestoActualizado
    });

  } catch (error) {
    console.error('Error al editar presupuesto:', error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        mensaje: 'Ya existe un presupuesto para esta categoría en ese periodo.'
      });
    }

    return res.status(500).json({
      mensaje: 'Error interno al editar presupuesto.'
    });
  }
};

const eliminarPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const presupuesto_id = Number(req.params.id);

    if (!presupuesto_id) {
      return res.status(400).json({
        mensaje: 'ID de presupuesto inválido.'
      });
    }

    const presupuestoEliminado = await desactivarPresupuesto(
      presupuesto_id,
      usuario_id
    );

    if (!presupuestoEliminado) {
      return res.status(404).json({
        mensaje: 'Presupuesto no encontrado o no pertenece al usuario.'
      });
    }

    return res.status(200).json({
      mensaje: 'Presupuesto eliminado correctamente.',
      presupuesto: presupuestoEliminado
    });

  } catch (error) {
    console.error('Error al eliminar presupuesto:', error);

    return res.status(500).json({
      mensaje: 'Error interno al eliminar presupuesto.'
    });
  }
};

module.exports = {
  listarPresupuestos,
  obtenerPresupuesto,
  registrarPresupuesto,
  editarPresupuesto,
  eliminarPresupuesto
};