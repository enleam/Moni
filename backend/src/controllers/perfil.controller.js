const bcrypt = require('bcryptjs');

const {
  obtenerPerfilPorId,
  obtenerUsuarioConPasswordPorId,
  actualizarNombrePerfil,
  actualizarPasswordPerfil
} = require('../models/perfil.model');

const obtenerPerfil = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const perfil = await obtenerPerfilPorId(usuario_id);

    if (!perfil) {
      return res.status(404).json({
        mensaje: 'Perfil no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Perfil obtenido correctamente.',
      perfil
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener perfil.'
    });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        mensaje: 'El nombre es obligatorio.'
      });
    }

    if (nombre.trim().length < 2) {
      return res.status(400).json({
        mensaje: 'El nombre debe tener al menos 2 caracteres.'
      });
    }

    if (nombre.trim().length > 100) {
      return res.status(400).json({
        mensaje: 'El nombre no puede superar los 100 caracteres.'
      });
    }

    const perfilActualizado = await actualizarNombrePerfil({
      usuario_id,
      nombre: nombre.trim()
    });

    if (!perfilActualizado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Perfil actualizado correctamente.',
      perfil: perfilActualizado
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);

    return res.status(500).json({
      mensaje: 'Error interno al actualizar perfil.'
    });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const usuario_id = req.usuario.usuario_id;

    const {
      passwordActual,
      nuevaPassword
    } = req.body;

    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({
        mensaje: 'La contraseña actual y la nueva contraseña son obligatorias.'
      });
    }

    if (nuevaPassword.length < 6) {
      return res.status(400).json({
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres.'
      });
    }

    const usuario = await obtenerUsuarioConPasswordPorId(usuario_id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.'
      });
    }

    const passwordValida = await bcrypt.compare(
      passwordActual,
      usuario.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'La contraseña actual es incorrecta.'
      });
    }

    const mismaPassword = await bcrypt.compare(
      nuevaPassword,
      usuario.password_hash
    );

    if (mismaPassword) {
      return res.status(400).json({
        mensaje: 'La nueva contraseña debe ser diferente a la actual.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(nuevaPassword, salt);

    await actualizarPasswordPerfil({
      usuario_id,
      password_hash
    });

    return res.status(200).json({
      mensaje: 'Contraseña actualizada correctamente.'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);

    return res.status(500).json({
      mensaje: 'Error interno al cambiar contraseña.'
    });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
};