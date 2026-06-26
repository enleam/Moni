const { sql, poolPromise } = require('../config/db');

const obtenerResumenReporteMensual = async ({
  usuario_id,
  anio,
  mes,
  tipo
}) => {
  const pool = await poolPromise;

  const request = pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('tipo', sql.NVarChar(20), tipo);

  const result = await request.query(`
    SELECT
      ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS total_ingresos,
      ISNULL(SUM(CASE WHEN tipo = 'GASTO' THEN monto ELSE 0 END), 0) AS total_gastos,
      ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END), 0) AS balance,
      COUNT(*) AS cantidad_movimientos,
      ISNULL(AVG(monto), 0) AS promedio_movimiento,
      ISNULL(MAX(monto), 0) AS mayor_movimiento,
      ISNULL(MIN(monto), 0) AS menor_movimiento
    FROM finance.Movimiento
    WHERE usuario_id = @usuario_id
      AND activo = 1
      AND YEAR(fecha) = @anio
      AND MONTH(fecha) = @mes
      AND (@tipo = 'TODOS' OR tipo = @tipo)
  `);

  return result.recordset[0];
};

const listarMovimientosReporteMensual = async ({
  usuario_id,
  anio,
  mes,
  tipo
}) => {
  const pool = await poolPromise;

  const request = pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('tipo', sql.NVarChar(20), tipo);

  const result = await request.query(`
    SELECT
      m.movimiento_id,
      CONVERT(VARCHAR(10), m.fecha, 23) AS fecha,
      m.tipo,
      c.nombre AS categoria,
      c.color AS categoria_color,
      m.monto,
      m.metodo_pago,
      m.descripcion,
      m.fecha_registro
    FROM finance.Movimiento m
    INNER JOIN finance.Categoria c
      ON m.categoria_id = c.categoria_id
    WHERE m.usuario_id = @usuario_id
      AND m.activo = 1
      AND YEAR(m.fecha) = @anio
      AND MONTH(m.fecha) = @mes
      AND (@tipo = 'TODOS' OR m.tipo = @tipo)
    ORDER BY m.fecha DESC, m.movimiento_id DESC
  `);

  return result.recordset;
};

const obtenerTotalesPorCategoriaReporte = async ({
  usuario_id,
  anio,
  mes,
  tipo
}) => {
  const pool = await poolPromise;

  const request = pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('tipo', sql.NVarChar(20), tipo);

  const result = await request.query(`
    SELECT
      c.nombre AS categoria,
      m.tipo,
      ISNULL(SUM(m.monto), 0) AS total,
      COUNT(*) AS cantidad
    FROM finance.Movimiento m
    INNER JOIN finance.Categoria c
      ON m.categoria_id = c.categoria_id
    WHERE m.usuario_id = @usuario_id
      AND m.activo = 1
      AND YEAR(m.fecha) = @anio
      AND MONTH(m.fecha) = @mes
      AND (@tipo = 'TODOS' OR m.tipo = @tipo)
    GROUP BY c.nombre, m.tipo
    ORDER BY total DESC
  `);

  return result.recordset;
};

module.exports = {
  obtenerResumenReporteMensual,
  listarMovimientosReporteMensual,
  obtenerTotalesPorCategoriaReporte
};