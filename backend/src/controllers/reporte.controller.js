const {
  obtenerResumenReporteMensual,
  listarMovimientosReporteMensual,
  obtenerTotalesPorCategoriaReporte
} = require('../models/reporte.model');

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

const normalizarTipo = (tipo) => {
  const tipoNormalizado = tipo ? String(tipo).toUpperCase() : 'TODOS';

  if (!['TODOS', 'INGRESO', 'GASTO'].includes(tipoNormalizado)) {
    return null;
  }

  return tipoNormalizado;
};

const obtenerReporteMensual = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);
    const tipo = normalizarTipo(req.query.tipo);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    if (!tipo) {
      return res.status(400).json({
        mensaje: 'Tipo inválido. Usa TODOS, INGRESO o GASTO.'
      });
    }

    const [resumen, movimientos, totalesPorCategoria] = await Promise.all([
      obtenerResumenReporteMensual({
        usuario_id,
        anio,
        mes,
        tipo
      }),
      listarMovimientosReporteMensual({
        usuario_id,
        anio,
        mes,
        tipo
      }),
      obtenerTotalesPorCategoriaReporte({
        usuario_id,
        anio,
        mes,
        tipo
      })
    ]);

    return res.status(200).json({
      mensaje: 'Reporte mensual obtenido correctamente.',
      filtros: {
        anio,
        mes,
        tipo
      },
      resumen,
      movimientos,
      totales_por_categoria: totalesPorCategoria
    });

  } catch (error) {
    console.error('Error al obtener reporte mensual:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener reporte mensual.'
    });
  }
};

module.exports = {
  obtenerReporteMensual
};