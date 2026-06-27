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

const invalidarTokensRecuperacionUsuario = async (usuario_id) => {
  const pool = await poolPromise;

  await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      UPDATE auth.TokenRecuperacionPassword
      SET usado = 1
      WHERE usuario_id = @usuario_id
        AND usado = 0
    `);
};

const crearTokenRecuperacionPassword = async ({
  usuario_id,
  token_hash,
  fecha_expiracion
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('token_hash', sql.NVarChar(255), token_hash)
    .input('fecha_expiracion', sql.DateTime2, fecha_expiracion)
    .query(`
      INSERT INTO auth.TokenRecuperacionPassword (
        usuario_id,
        token_hash,
        fecha_expiracion
      )
      OUTPUT
        INSERTED.token_id,
        INSERTED.usuario_id,
        INSERTED.fecha_expiracion,
        INSERTED.usado,
        INSERTED.fecha_registro
      VALUES (
        @usuario_id,
        @token_hash,
        @fecha_expiracion
      )
    `);

  return result.recordset[0];
};

const buscarTokenRecuperacionValido = async (token_hash) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('token_hash', sql.NVarChar(255), token_hash)
    .query(`
      SELECT
        t.token_id,
        t.usuario_id,
        t.token_hash,
        t.fecha_expiracion,
        t.usado,
        u.correo,
        u.nombre
      FROM auth.TokenRecuperacionPassword t
      INNER JOIN auth.Usuario u
        ON t.usuario_id = u.usuario_id
      WHERE t.token_hash = @token_hash
        AND t.usado = 0
        AND t.fecha_expiracion > SYSDATETIME()
        AND u.activo = 1
    `);

  return result.recordset[0];
};

const marcarTokenRecuperacionUsado = async (token_id) => {
  const pool = await poolPromise;

  await pool.request()
    .input('token_id', sql.Int, token_id)
    .query(`
      UPDATE auth.TokenRecuperacionPassword
      SET usado = 1
      WHERE token_id = @token_id
    `);
};

const actualizarPasswordUsuario = async ({
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
  buscarUsuarioPorCorreo,
  crearUsuario,
  buscarUsuarioPorId,
  invalidarTokensRecuperacionUsuario,
  crearTokenRecuperacionPassword,
  buscarTokenRecuperacionValido,
  marcarTokenRecuperacionUsado,
  actualizarPasswordUsuario
};