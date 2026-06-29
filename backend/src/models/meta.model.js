const { sql, poolPromise } = require('../config/db');

const listarMetasPorUsuario = async (usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        meta_id,
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_objetivo,
        estado,
        activo,
        fecha_registro
      FROM finance.MetaAhorro
      WHERE usuario_id = @usuario_id
        AND activo = 1
      ORDER BY
        CASE WHEN estado = 'ACTIVA' THEN 0 ELSE 1 END,
        fecha_registro DESC
    `);

  return result.recordset;
};

const obtenerMetaPorId = async ({ meta_id, usuario_id }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('meta_id', sql.Int, meta_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        meta_id,
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_objetivo,
        estado,
        activo,
        fecha_registro
      FROM finance.MetaAhorro
      WHERE meta_id = @meta_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const crearMeta = async ({
  usuario_id,
  nombre,
  descripcion,
  monto_objetivo,
  monto_actual,
  fecha_objetivo
}) => {
  const pool = await poolPromise;

  const estado = monto_actual >= monto_objetivo ? 'COMPLETADA' : 'ACTIVA';

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('nombre', sql.NVarChar(100), nombre)
    .input('descripcion', sql.NVarChar(250), descripcion || null)
    .input('monto_objetivo', sql.Decimal(10, 2), monto_objetivo)
    .input('monto_actual', sql.Decimal(10, 2), monto_actual)
    .input('fecha_objetivo', sql.Date, fecha_objetivo || null)
    .input('estado', sql.NVarChar(20), estado)
    .query(`
      INSERT INTO finance.MetaAhorro (
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_objetivo,
        estado
      )
      OUTPUT
        INSERTED.meta_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.descripcion,
        INSERTED.monto_objetivo,
        INSERTED.monto_actual,
        INSERTED.fecha_objetivo,
        INSERTED.estado,
        INSERTED.activo,
        INSERTED.fecha_registro
      VALUES (
        @usuario_id,
        @nombre,
        @descripcion,
        @monto_objetivo,
        @monto_actual,
        @fecha_objetivo,
        @estado
      )
    `);

  return result.recordset[0];
};

const actualizarMeta = async ({
  meta_id,
  usuario_id,
  nombre,
  descripcion,
  monto_objetivo,
  monto_actual,
  fecha_objetivo
}) => {
  const pool = await poolPromise;

  const estado = monto_actual >= monto_objetivo ? 'COMPLETADA' : 'ACTIVA';

  const result = await pool.request()
    .input('meta_id', sql.Int, meta_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('nombre', sql.NVarChar(100), nombre)
    .input('descripcion', sql.NVarChar(250), descripcion || null)
    .input('monto_objetivo', sql.Decimal(10, 2), monto_objetivo)
    .input('monto_actual', sql.Decimal(10, 2), monto_actual)
    .input('fecha_objetivo', sql.Date, fecha_objetivo || null)
    .input('estado', sql.NVarChar(20), estado)
    .query(`
      UPDATE finance.MetaAhorro
      SET
        nombre = @nombre,
        descripcion = @descripcion,
        monto_objetivo = @monto_objetivo,
        monto_actual = @monto_actual,
        fecha_objetivo = @fecha_objetivo,
        estado = @estado
      OUTPUT
        INSERTED.meta_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.descripcion,
        INSERTED.monto_objetivo,
        INSERTED.monto_actual,
        INSERTED.fecha_objetivo,
        INSERTED.estado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE meta_id = @meta_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const registrarAvanceMeta = async ({
  meta_id,
  usuario_id,
  monto_avance
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('meta_id', sql.Int, meta_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('monto_avance', sql.Decimal(10, 2), monto_avance)
    .query(`
      UPDATE finance.MetaAhorro
      SET
        monto_actual =
          CASE
            WHEN monto_actual + @monto_avance >= monto_objetivo
              THEN monto_objetivo
            ELSE monto_actual + @monto_avance
          END,
        estado =
          CASE
            WHEN monto_actual + @monto_avance >= monto_objetivo
              THEN 'COMPLETADA'
            ELSE 'ACTIVA'
          END
      OUTPUT
        INSERTED.meta_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.descripcion,
        INSERTED.monto_objetivo,
        INSERTED.monto_actual,
        INSERTED.fecha_objetivo,
        INSERTED.estado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE meta_id = @meta_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const eliminarMeta = async ({ meta_id, usuario_id }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('meta_id', sql.Int, meta_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      UPDATE finance.MetaAhorro
      SET activo = 0
      OUTPUT
        INSERTED.meta_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.descripcion,
        INSERTED.monto_objetivo,
        INSERTED.monto_actual,
        INSERTED.fecha_objetivo,
        INSERTED.estado,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE meta_id = @meta_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

module.exports = {
  listarMetasPorUsuario,
  obtenerMetaPorId,
  crearMeta,
  actualizarMeta,
  registrarAvanceMeta,
  eliminarMeta
};