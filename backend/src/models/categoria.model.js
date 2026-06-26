const { sql, poolPromise } = require('../config/db');

const listarCategoriasPorUsuario = async (usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT
        categoria_id,
        usuario_id,
        nombre,
        tipo,
        color,
        activo,
        fecha_registro
      FROM finance.Categoria
      WHERE usuario_id = @usuario_id
        AND activo = 1
      ORDER BY tipo ASC, nombre ASC
    `);

  return result.recordset;
};

const obtenerCategoriaPorId = async (categoria_id, usuario_id) => {
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
        color,
        activo,
        fecha_registro
      FROM finance.Categoria
      WHERE categoria_id = @categoria_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const crearCategoria = async ({
  usuario_id,
  nombre,
  tipo,
  color
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .input('nombre', sql.NVarChar(100), nombre)
    .input('tipo', sql.NVarChar(20), tipo)
    .input('color', sql.NVarChar(20), color || null)
    .query(`
      INSERT INTO finance.Categoria (
        usuario_id,
        nombre,
        tipo,
        color
      )
      OUTPUT
        INSERTED.categoria_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.tipo,
        INSERTED.color,
        INSERTED.activo,
        INSERTED.fecha_registro
      VALUES (
        @usuario_id,
        @nombre,
        @tipo,
        @color
      )
    `);

  return result.recordset[0];
};

const actualizarCategoria = async ({
  categoria_id,
  usuario_id,
  nombre,
  tipo,
  color
}) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('categoria_id', sql.Int, categoria_id)
    .input('usuario_id', sql.Int, usuario_id)
    .input('nombre', sql.NVarChar(100), nombre)
    .input('tipo', sql.NVarChar(20), tipo)
    .input('color', sql.NVarChar(20), color || null)
    .query(`
      UPDATE finance.Categoria
      SET
        nombre = @nombre,
        tipo = @tipo,
        color = @color
      OUTPUT
        INSERTED.categoria_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.tipo,
        INSERTED.color,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE categoria_id = @categoria_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

const desactivarCategoria = async (categoria_id, usuario_id) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('categoria_id', sql.Int, categoria_id)
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      UPDATE finance.Categoria
      SET activo = 0
      OUTPUT
        INSERTED.categoria_id,
        INSERTED.usuario_id,
        INSERTED.nombre,
        INSERTED.tipo,
        INSERTED.color,
        INSERTED.activo,
        INSERTED.fecha_registro
      WHERE categoria_id = @categoria_id
        AND usuario_id = @usuario_id
        AND activo = 1
    `);

  return result.recordset[0];
};

module.exports = {
  listarCategoriasPorUsuario,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  desactivarCategoria
};