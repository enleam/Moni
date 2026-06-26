const { sql, poolPromise } = require('../config/db');

const buscarUsuarioPorCorreo = async (correo) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('correo', sql.NVarChar(150), correo)
    .query(`
      SELECT 
        usuario_id,
        nombre,
        correo,
        password_hash,
        fecha_registro,
        activo
      FROM auth.Usuario
      WHERE correo = @correo
    `);

  return result.recordset[0];
};

const crearUsuario = async ({ nombre, correo, password_hash }) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('nombre', sql.NVarChar(100), nombre)
    .input('correo', sql.NVarChar(150), correo)
    .input('password_hash', sql.NVarChar(255), password_hash)
    .query(`
      INSERT INTO auth.Usuario (
        nombre,
        correo,
        password_hash
      )
      OUTPUT 
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.correo,
        INSERTED.fecha_registro,
        INSERTED.activo
      VALUES (
        @nombre,
        @correo,
        @password_hash
      )
    `);

  return result.recordset[0];
};

const buscarUsuarioPorId = async (usuario_id) => {
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

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  buscarUsuarioPorId
};