const {
  listarMetasPorUsuario,
  obtenerMetaPorId,
  crearMeta,
  actualizarMeta,
  registrarAvanceMeta,
  eliminarMeta
} = require('../models/meta.model');

const validarMetaData = ({
  nombre,
  descripcion,
  monto_objetivo,
  monto_actual
}) => {
  if (!nombre || !nombre.trim()) {
    return 'El nombre de la meta es obligatorio.';
  }

  if (nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.';
  }

  if (nombre.trim().length > 100) {
    return 'El nombre no puede superar los 100 caracteres.';
  }

  if (descripcion && descripcion.length > 250) {
    return 'La descripción no puede superar los 250 caracteres.';
  }

  const montoObjetivoNumero = Number(monto_objetivo);
  const montoActualNumero = Number(monto_actual || 0);

  if (Number.isNaN(montoObjetivoNumero) || montoObjetivoNumero <= 0) {
    return 'El monto objetivo debe ser mayor a 0.';
  }

  if (Number.isNaN(montoActualNumero) || montoActualNumero < 0) {
    return 'El monto actual no puede ser negativo.';
  }

  if (montoActualNumero > montoObjetivoNumero) {
    return 'El monto actual no puede superar el monto objetivo.';
  }

  return null;
};

const listarMetas = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const metas = await listarMetasPorUsuario(usuario_id);

    return res.status(200).json({
      mensaje: 'Metas obtenidas correctamente.',
      metas
    });
  } catch (error) {
    console.error('Error al listar metas:', error);

    return res.status(500).json({
      mensaje: 'Error interno al listar metas.'
    });
  }
};

const obtenerMeta = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const meta_id = Number(req.params.id);

    if (!meta_id || Number.isNaN(meta_id)) {
      return res.status(400).json({
        mensaje: 'ID de meta inválido.'
      });
    }

    const meta = await obtenerMetaPorId({
      meta_id,
      usuario_id
    });

    if (!meta) {
      return res.status(404).json({
        mensaje: 'Meta no encontrada.'
      });
    }

    return res.status(200).json({
      mensaje: 'Meta obtenida correctamente.',
      meta
    });
  } catch (error) {
    console.error('Error al obtener meta:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener meta.'
    });
  }
};

const registrarMeta = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const {
      nombre,
      descripcion,
      monto_objetivo,
      monto_actual,
      fecha_objetivo
    } = req.body;

    const errorValidacion = validarMetaData({
      nombre,
      descripcion,
      monto_objetivo,
      monto_actual
    });

    if (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion
      });
    }

    const meta = await crearMeta({
      usuario_id,
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      monto_objetivo: Number(monto_objetivo),
      monto_actual: Number(monto_actual || 0),
      fecha_objetivo: fecha_objetivo || null
    });

    return res.status(201).json({
      mensaje: 'Meta creada correctamente.',
      meta
    });
  } catch (error) {
    console.error('Error al crear meta:', error);

    return res.status(500).json({
      mensaje: 'Error interno al crear meta.'
    });
  }
};

const editarMeta = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const meta_id = Number(req.params.id);

    if (!meta_id || Number.isNaN(meta_id)) {
      return res.status(400).json({
        mensaje: 'ID de meta inválido.'
      });
    }

    const {
      nombre,
      descripcion,
      monto_objetivo,
      monto_actual,
      fecha_objetivo
    } = req.body;

    const errorValidacion = validarMetaData({
      nombre,
      descripcion,
      monto_objetivo,
      monto_actual
    });

    if (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion
      });
    }

    const metaActualizada = await actualizarMeta({
      meta_id,
      usuario_id,
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      monto_objetivo: Number(monto_objetivo),
      monto_actual: Number(monto_actual || 0),
      fecha_objetivo: fecha_objetivo || null
    });

    if (!metaActualizada) {
      return res.status(404).json({
        mensaje: 'Meta no encontrada.'
      });
    }

    return res.status(200).json({
      mensaje: 'Meta actualizada correctamente.',
      meta: metaActualizada
    });
  } catch (error) {
    console.error('Error al editar meta:', error);

    return res.status(500).json({
      mensaje: 'Error interno al editar meta.'
    });
  }
};

const registrarAvance = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const meta_id = Number(req.params.id);
    const { monto_avance } = req.body;

    if (!meta_id || Number.isNaN(meta_id)) {
      return res.status(400).json({
        mensaje: 'ID de meta inválido.'
      });
    }

    const montoAvanceNumero = Number(monto_avance);

    if (Number.isNaN(montoAvanceNumero) || montoAvanceNumero <= 0) {
      return res.status(400).json({
        mensaje: 'El avance debe ser mayor a 0.'
      });
    }

    const meta = await obtenerMetaPorId({
      meta_id,
      usuario_id
    });

    if (!meta) {
      return res.status(404).json({
        mensaje: 'Meta no encontrada.'
      });
    }

    if (meta.estado === 'COMPLETADA') {
      return res.status(400).json({
        mensaje: 'La meta ya está completada.'
      });
    }

    const metaActualizada = await registrarAvanceMeta({
      meta_id,
      usuario_id,
      monto_avance: montoAvanceNumero
    });

    return res.status(200).json({
      mensaje: 'Avance registrado correctamente.',
      meta: metaActualizada
    });
  } catch (error) {
    console.error('Error al registrar avance:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar avance.'
    });
  }
};

const desactivarMeta = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const meta_id = Number(req.params.id);

    if (!meta_id || Number.isNaN(meta_id)) {
      return res.status(400).json({
        mensaje: 'ID de meta inválido.'
      });
    }

    const metaEliminada = await eliminarMeta({
      meta_id,
      usuario_id
    });

    if (!metaEliminada) {
      return res.status(404).json({
        mensaje: 'Meta no encontrada.'
      });
    }

    return res.status(200).json({
      mensaje: 'Meta eliminada correctamente.',
      meta: metaEliminada
    });
  } catch (error) {
    console.error('Error al eliminar meta:', error);

    return res.status(500).json({
      mensaje: 'Error interno al eliminar meta.'
    });
  }
};

module.exports = {
  listarMetas,
  obtenerMeta,
  registrarMeta,
  editarMeta,
  registrarAvance,
  desactivarMeta
};