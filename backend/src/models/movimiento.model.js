const { sql, poolPromise } = require('../config/db');

const listarMovimientosPorUsuario = async (usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        m.movimiento_id,
        m.usuario_id,
        m.categoria_id,
        c.nombre AS categoria_nombre,
        c.color AS categoria_color,
        m.tipo,
        m.monto,
        m.fecha,
        m.descripcion,
        m.metodo_pago,
        m.activo,
        m.fecha_registro
      FROM finance.Movimiento m
      INNER JOIN finance.Categoria c
        ON m.categoria_id = c.categoria_id
      WHERE m.usuario_id = @usuario_id
        AND m.activo = 1
      ORDER BY m.fecha DESC, m.movimiento_id DESC
    `);

  return result.recordset;
};

const obtenerMovimientoPorId = async (movimiento_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('movimiento_id', sql.Int, movimiento_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        m.movimiento_id,
        m.usuario_id,
        m.categoria_id,
        c.nombre AS categoria_nombre,
        c.color AS categoria_color,
        m.tipo,
        m.monto,
        m.fecha,
        m.descripcion,
        m.metodo_pago,
        m.activo,
        m.fecha_registro
      FROM finance.Movimiento m
      INNER JOIN finance.Categoria c
        ON m.categoria_id = c.categoria_id
      WHERE m.movimiento_id = @movimiento_id
        AND m.usuario_id = @usuario_id
        AND m.activo = 1
    `);

  return result.recordset[0];
};

const obtenerCategoriaValida = async ({
  categoria_id,
  usuario_id,
  tipo
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('categoria_id', sql.Int, categoria_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('tipo', sql.NVarChar(20), tipo)
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
        AND tipo = @tipo
        AND activo = 1
    `);

  return result.recordset[0];
};

const crearMovimiento = async ({
  usuario_id,
  categoria_id,
  tipo,
  monto,
  fecha,
  descripcion,
  metodo_pago
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('tipo', sql.NVarChar(20), tipo)
    .input('monto', sql.Decimal(10, 2), monto)
    .input('fecha', sql.Date, fecha)
    .input('descripcion', sql.NVarChar(250), descripcion || null)
    .input('metodo_pago', sql.NVarChar(50), metodo_pago || null)
    .query(`
      INSERT INTO finance.Movimiento (
        usuario_id,
        categoria_id,
        tipo,
        monto,
        fecha,
        descripcion,
        metodo_pago
      )
      OUTPUT
        INSERTED.movimiento_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.tipo,
        INSERTED.monto,
        INSERTED.fecha,
        INSERTED.descripcion,
        INSERTED.metodo_pago,
        INSERTED.activo,
        INSERTED.fecha_registro
      VALUES (
        @usuario_id,
        @categoria_id,
        @tipo,
        @monto,
        @fecha,
        @descripcion,
        @metodo_pago
      )
    `);

  return result.recordset[0];
};

const actualizarMovimiento = async ({
  movimiento_id,
  usuario_id,
  categoria_id,
  tipo,
  monto,
  fecha,
  descripcion,
  metodo_pago
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('movimiento_id', sql.Int, movimiento_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('categoria_id', sql.Int, categoria_id)
    .input('tipo', sql.NVarChar(20), tipo)
    .input('monto', sql.Decimal(10, 2), monto)
    .input('fecha', sql.Date, fecha)
    .input('descripcion', sql.NVarChar(250), descripcion || null)
    .input('metodo_pago', sql.NVarChar(50), metodo_pago || null)
    .query(`
      UPDATE finance.Movimiento
      SET
        categoria_id = @categoria_id,
        tipo = @tipo,
        monto = @monto,
        fecha = @fecha,
        descripcion = @descripcion,
        metodo_pago = @metodo_pago
      OUTPUT
        INSERTED.movimiento_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.tipo,
        INSERTED.monto,
        INSERTED.fecha,
        INSERTED.descripcion,
        INSERTED.metodo_pago,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE movimiento_id = @movimiento_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const desactivarMovimiento = async (movimiento_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('movimiento_id', sql.Int, movimiento_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      UPDATE finance.Movimiento
      SET activo = 0
      OUTPUT
        INSERTED.movimiento_id,
        INSERTED.usuario_id,
        INSERTED.categoria_id,
        INSERTED.tipo,
        INSERTED.monto,
        INSERTED.fecha,
        INSERTED.descripcion,
        INSERTED.metodo_pago,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE movimiento_id = @movimiento_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

module.exports = {
  listarMovimientosPorUsuario,
  obtenerMovimientoPorId,
  obtenerCategoriaValida,
  crearMovimiento,
  actualizarMovimiento,
  desactivarMovimiento
};