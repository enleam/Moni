const {
  obtenerResumenDashboard,
  obtenerGastosPorCategoria,
  obtenerIngresosVsGastos,
  obtenerEvolucionGastos
} = require('../models/dashboard.model');

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

const obtenerResumen = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    const resumen = await obtenerResumenDashboard({
      usuario_id,
      anio,
      mes
    });

    return res.status(200).json({
      mensaje: 'Resumen del dashboard obtenido correctamente.',
      periodo: { anio, mes },
      resumen
    });

  } catch (error) {
    console.error('Error al obtener resumen del dashboard:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener resumen del dashboard.'
    });
  }
};

const listarGastosPorCategoria = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    const gastos = await obtenerGastosPorCategoria({
      usuario_id,
      anio,
      mes
    });

    return res.status(200).json({
      mensaje: 'Gastos por categoría obtenidos correctamente.',
      periodo: { anio, mes },
      gastos
    });

  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener gastos por categoría.'
    });
  }
};

const listarIngresosVsGastos = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    const datos = await obtenerIngresosVsGastos({
      usuario_id,
      anio,
      mes
    });

    return res.status(200).json({
      mensaje: 'Ingresos vs gastos obtenidos correctamente.',
      periodo: { anio, mes },
      datos
    });

  } catch (error) {
    console.error('Error al obtener ingresos vs gastos:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener ingresos vs gastos.'
    });
  }
};

const listarEvolucionGastos = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { anio, mes } = obtenerPeriodo(req);

    if (!validarPeriodo(anio, mes)) {
      return res.status(400).json({
        mensaje: 'Periodo inválido.'
      });
    }

    const datos = await obtenerEvolucionGastos({
      usuario_id,
      anio,
      mes
    });

    return res.status(200).json({
      mensaje: 'Evolución de gastos obtenida correctamente.',
      periodo: { anio, mes },
      datos
    });

  } catch (error) {
    console.error('Error al obtener evolución de gastos:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener evolución de gastos.'
    });
  }
};

module.exports = {
  obtenerResumen,
  listarGastosPorCategoria,
  listarIngresosVsGastos,
  listarEvolucionGastos
};