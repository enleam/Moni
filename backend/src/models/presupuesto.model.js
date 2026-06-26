const { sql, poolPromise } = require('../config/db');

const listarPresupuestosPorUsuario = async ({ usuario_id, anio, mes }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        p.presupuesto_id,
        p.usuario_id,
        p.categoria_id,
        c.nombre AS categoria_nombre,
        c.color AS categoria_color,
        p.anio,
        p.mes,
        p.monto_presupuestado,
        ISNULL(SUM(m.monto), 0) AS monto_gastado,
        p.monto_presupuestado - ISNULL(SUM(m.monto), 0) AS monto_disponible,
        CASE 
          WHEN p.monto_presupuestado > 0 
          THEN (ISNULL(SUM(m.monto), 0) * 100.0) / p.monto_presupuestado
          ELSE 0
        END AS porcentaje_usado,
        p.activo,
        p.fecha_registro
      FROM finance.PresupuestoMensual p
      INNER JOIN finance.Categoria c
        ON p.categoria_id = c.categoria_id
      LEFT JOIN finance.Movimiento m
        ON m.categoria_id = p.categoria_id
        AND m.usuario_id = p.usuario_id
        AND m.tipo = 'GASTO'
        AND m.activo = 1
        AND YEAR(m.fecha) = p.anio
        AND MONTH(m.fecha) = p.mes
      WHERE p.usuario_id = @usuario_id
        AND p.anio = @anio
        AND p.mes = @mes
        AND p.activo = 1
      GROUP BY
        p.presupuesto_id,
        p.usuario_id,
        p.categoria_id,
        c.nombre,
        c.color,
        p.anio,
        p.mes,
        p.monto_presupuestado,
        p.activo,
        p.fecha_registro
      ORDER BY c.nombre ASC
    `);

  return result.recordset;
};

const obtenerPresupuestoPorId = async (presupuesto_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('presupuesto_id', sql.Int, presupuesto_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        presupuesto_id,
        usuario_id,
        categoria_id,
        anio,
        mes,
        monto_presupuestado,
        activo,
        fecha_registro
      FROM finance.PresupuestoMensual
      WHERE presupuesto_id = @presupuesto_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const obtenerCategoriaGastoValida = async (categoria_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('categoria_id', sql.Int, categoria_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        categoria_id,
        usuario_id,
        nombre,
        tipo,
        activo
      FROM finance.Categoria
      WHERE categoria_id = @categoria_id
        AND usuario_id = @usuario_id
        AND tipo = 'GASTO'
        AND activo = 1
    `);

  return result.recordset[0];
};

const buscarPresupuestoExistente = async ({
  usuario_id,
  categoria_id,
  anio,
  mes
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .query(`
      SELECT
        presupuesto_id,
        activo
      FROM finance.PresupuestoMensual
      WHERE usuario_id = @usuario_id
        AND categoria_id = @categoria_id
        AND anio = @anio
        AND mes = @mes
    `);

  return result.recordset[0];
};

const crearPresupuesto = async ({
  usuario_id,
  categoria_id,
  anio,
  mes,
  monto_presupuestado
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('monto_presupuestado', sql.Decimal(10, 2), monto_presupuestado)
    .query(`
      INSERT INTO finance.PresupuestoMensual (
        usuario_id,
        categoria_id,
        anio,
        mes,
        monto_presupuestado
      )
      OUTPUT
        INSERTED.presupuesto_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.anio,
        INSERTED.mes,
        INSERTED.monto_presupuestado,
        INSERTED.activo,
        INSERTED.fecha_registro
      VALUES (
        @usuario_id,
        @categoria_id,
        @anio,
        @mes,
        @monto_presupuestado
      )
    `);

  return result.recordset[0];
};

const actualizarPresupuesto = async ({
  presupuesto_id,
  usuario_id,
  categoria_id,
  anio,
  mes,
  monto_presupuestado
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('presupuesto_id', sql.Int, presupuesto_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('monto_presupuestado', sql.Decimal(10, 2), monto_presupuestado)
    .query(`
      UPDATE finance.PresupuestoMensual
      SET
        categoria_id = @categoria_id,
        anio = @anio,
        mes = @mes,
        monto_presupuestado = @monto_presupuestado
      OUTPUT
        INSERTED.presupuesto_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.anio,
        INSERTED.mes,
        INSERTED.monto_presupuestado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE presupuesto_id = @presupuesto_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const desactivarPresupuesto = async (presupuesto_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('presupuesto_id', sql.Int, presupuesto_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      UPDATE finance.PresupuestoMensual
      SET activo = 0
      OUTPUT
        INSERTED.presupuesto_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.anio,
        INSERTED.mes,
        INSERTED.monto_presupuestado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE presupuesto_id = @presupuesto_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const reactivarPresupuesto = async ({
  presupuesto_id,
  usuario_id,
  categoria_id,
  anio,
  mes,
  monto_presupuestado
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('presupuesto_id', sql.Int, presupuesto_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('anio', sql.Int, anio)
    .input('mes', sql.Int, mes)
    .input('monto_presupuestado', sql.Decimal(10, 2), monto_presupuestado)
    .query(`
      UPDATE finance.PresupuestoMensual
      SET
        monto_presupuestado = @monto_presupuestado,
        activo = 1
      OUTPUT
        INSERTED.presupuesto_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.anio,
        INSERTED.mes,
        INSERTED.monto_presupuestado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE presupuesto_id = @presupuesto_id
        AND usuario_id = @usuario_id
        AND categoria_id = @categoria_id
        AND anio = @anio
        AND mes = @mes
        AND activo = 0
    `);

  return result.recordset[0];
};

module.exports = {
  listarPresupuestosPorUsuario,
  obtenerPresupuestoPorId,
  obtenerCategoriaGastoValida,
  buscarPresupuestoExistente,
  crearPresupuesto,
  actualizarPresupuesto,
  desactivarPresupuesto,
  reactivarPresupuesto
};