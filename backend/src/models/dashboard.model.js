const { sql, poolPromise } = require('../config/db');

const obtenerResumenDashboard = async ({ usuario_id, anio, mes }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS total_ingresos,
        ISNULL(SUM(CASE WHEN tipo = 'GASTO' THEN monto ELSE 0 END), 0) AS total_gastos,
        ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END), 0) AS balance,
        COUNT(*) AS cantidad_movimientos
      FROM finance.Movimiento
      WHERE usuario_id = @usuario_id
        AND activo = 1
        AND YEAR(fecha) = @anio
        AND MONTH(fecha) = @mes
    `);

  const categoriaResult = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT TOP 1
        c.nombre AS categoria_mayor_gasto,
        SUM(m.monto) AS total_categoria
      FROM finance.Movimiento m
      INNER JOIN finance.Categoria c
        ON m.categoria_id = c.categoria_id
      WHERE m.usuario_id = @usuario_id
        AND m.activo = 1
        AND m.tipo = 'GASTO'
        AND YEAR(m.fecha) = @anio
        AND MONTH(m.fecha) = @mes
      GROUP BY c.nombre
      ORDER BY SUM(m.monto) DESC
    `);

  return {
    ...result.recordset[0],
    categoria_mayor_gasto:
      categoriaResult.recordset[0]?.categoria_mayor_gasto || 'Sin gastos',
    total_categoria_mayor_gasto:
      categoriaResult.recordset[0]?.total_categoria || 0
  };
};

const obtenerGastosPorCategoria = async ({ usuario_id, anio, mes }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        c.nombre AS categoria,
        c.color,
        SUM(m.monto) AS total
      FROM finance.Movimiento m
      INNER JOIN finance.Categoria c
        ON m.categoria_id = c.categoria_id
      WHERE m.usuario_id = @usuario_id
        AND m.activo = 1
        AND m.tipo = 'GASTO'
        AND YEAR(m.fecha) = @anio
        AND MONTH(m.fecha) = @mes
      GROUP BY c.nombre, c.color
      ORDER BY total DESC
    `);

  return result.recordset;
};

const obtenerIngresosVsGastos = async ({ usuario_id, anio, mes }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        CONCAT(YEAR(fecha), '-', RIGHT('0' + CAST(MONTH(fecha) AS VARCHAR(2)), 2)) AS periodo,
        ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS ingresos,
        ISNULL(SUM(CASE WHEN tipo = 'GASTO' THEN monto ELSE 0 END), 0) AS gastos,
        ISNULL(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END), 0) AS balance
      FROM finance.Movimiento
      WHERE usuario_id = @usuario_id
        AND activo = 1
        AND YEAR(fecha) = @anio
        AND MONTH(fecha) = @mes
      GROUP BY YEAR(fecha), MONTH(fecha)
      ORDER BY YEAR(fecha), MONTH(fecha)
    `);

  return result.recordset;
};

const obtenerEvolucionGastos = async ({ usuario_id, anio, mes }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        CONVERT(VARCHAR(10), fecha, 23) AS fecha,
        SUM(monto) AS total
      FROM finance.Movimiento
      WHERE usuario_id = @usuario_id
        AND activo = 1
        AND tipo = 'GASTO'
        AND YEAR(fecha) = @anio
        AND MONTH(fecha) = @mes
      GROUP BY fecha
      ORDER BY fecha ASC
    `);

  return result.recordset;
};

module.exports = {
  obtenerResumenDashboard,
  obtenerGastosPorCategoria,
  obtenerIngresosVsGastos,
  obtenerEvolucionGastos
};