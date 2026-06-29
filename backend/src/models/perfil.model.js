const { sql, poolPromise } = require('../config/db');

const obtenerPerfilPorId = async (usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        usuario_id,
        nombre,
        correo,
        fecha_registro,
        activo
      FROM auth.Usuario
      WHERE usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const obtenerUsuarioConPasswordPorId = async (usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        usuario_id,
        nombre,
        correo,
        password_hash,
        activo
      FROM auth.Usuario
      WHERE usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const actualizarNombrePerfil = async ({
  usuario_id,
  nombre
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('nombre', sql.NVarChar(100), nombre)
    .query(`
      UPDATE auth.Usuario
      SET nombre = @nombre
      OUTPUT
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.correo,
        INSERTED.fecha_registro,
        INSERTED.activo
      WHERE usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const actualizarPasswordPerfil = async ({
  usuario_id,
  password_hash
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('password_hash', sql.NVarChar(255), password_hash)
    .query(`
      UPDATE auth.Usuario
      SET password_hash = @password_hash
      OUTPUT
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.correo,
        INSERTED.fecha_registro,
        INSERTED.activo
      WHERE usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

module.exports = {
  obtenerPerfilPorId,
  obtenerUsuarioConPasswordPorId,
  actualizarNombrePerfil,
  actualizarPasswordPerfil
};