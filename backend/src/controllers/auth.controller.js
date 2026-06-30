const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
  buscarUsuarioPorCorreo,
  crearUsuario,
  buscarUsuarioPorId,
  invalidarTokensRecuperacionUsuario,
  crearTokenRecuperacionPassword,
  buscarTokenRecuperacionValido,
  marcarTokenRecuperacionUsado,
  actualizarPasswordUsuario,
  invalidarTokensVerificacionUsuario,
  crearTokenVerificacionEmail,
  buscarTokenVerificacionValido,
  marcarTokenVerificacionUsado,
  marcarEmailVerificado
} = require('../models/auth.model');

const {
  enviarCorreoRecuperacionPassword,
  enviarCorreoVerificacionEmail
} = require('../services/mail.service');

const generarToken = (usuario) => {
  return jwt.sign(
    {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    }
  );
};

const generarTokenSeguro = () => {
  const token = crypto.randomBytes(32).toString('hex');

  const token_hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return {
    token,
    token_hash
  };
};

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: 'Nombre, correo y contraseña son obligatorios.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const correoLimpio = correo.trim();
    const nombreLimpio = nombre.trim();

    const usuarioExistente = await buscarUsuarioPorCorreo(correoLimpio);

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'El correo ya está registrado.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await crearUsuario({
      nombre: nombreLimpio,
      correo: correoLimpio,
      password_hash
    });

    await invalidarTokensVerificacionUsuario(nuevoUsuario.usuario_id);

    const { token, token_hash } = generarTokenSeguro();

    const minutosExpiracion = Number(
      process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES || 60
    );

    const fecha_expiracion = new Date(
      Date.now() + minutosExpiracion * 60 * 1000
    );

    await crearTokenVerificacionEmail({
      usuario_id: nuevoUsuario.usuario_id,
      token_hash,
      fecha_expiracion
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verificar-email/${token}`;

    await enviarCorreoVerificacionEmail({
      correoDestino: nuevoUsuario.correo,
      nombre: nuevoUsuario.nombre,
      verificationLink
    });

    const respuesta = {
      mensaje: 'Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.'
    };

    if (process.env.MAIL_MODE !== 'gmail') {
      respuesta.verificationLink = verificationLink;
    }

    return res.status(201).json(respuesta);

  } catch (error) {
    console.error('Error al registrar usuario:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar usuario.'
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios.'
      });
    }

    const usuario = await buscarUsuarioPorCorreo(correo.trim());

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas.'
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        mensaje: 'El usuario se encuentra inactivo.'
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas.'
      });
    }

    if (!usuario.email_verificado) {
      return res.status(403).json({
        mensaje: 'Debes verificar tu correo antes de iniciar sesión.'
      });
    }

    const token = generarToken(usuario);

    return res.status(200).json({
      mensaje: 'Inicio de sesión correcto.',
      token,
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        fecha_registro: usuario.fecha_registro,
        activo: usuario.activo
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    return res.status(500).json({
      mensaje: 'Error interno al iniciar sesión.'
    });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await buscarUsuarioPorId(req.usuario.usuario_id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Perfil obtenido correctamente.',
      usuario
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener perfil.'
    });
  }
};

const generarTokenRecuperacion = () => {
  const token = crypto.randomBytes(32).toString('hex');

  const token_hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return {
    token,
    token_hash
  };
};

const solicitarRecuperacionPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo || !correo.trim()) {
      return res.status(400).json({
        mensaje: 'El correo es obligatorio.'
      });
    }

    const correoLimpio = correo.trim();

    const mensajeGenerico = 
      'Si el correo existe, se enviaron instrucciones para recuperar la contraseña.';

    const usuario = await buscarUsuarioPorCorreo(correoLimpio);

    if (!usuario || !usuario.activo) {
      return res.status(200).json({
        mensaje: mensajeGenerico
      });
    }

    await invalidarTokensRecuperacionUsuario(usuario.usuario_id);

    const { token, token_hash } = generarTokenSeguro();

    const minutosExpiracion = Number(
      process.env.PASSWORD_RESET_EXPIRES_MINUTES || 30
    );

    const fecha_expiracion = new Date(
      Date.now() + minutosExpiracion * 60 * 1000
    );

    await crearTokenRecuperacionPassword({
      usuario_id: usuario.usuario_id,
      token_hash,
      fecha_expiracion
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    await enviarCorreoRecuperacionPassword({
      correoDestino: usuario.correo,
      nombre: usuario.nombre,
      resetLink
    });

    const respuesta = {
      mensaje: mensajeGenerico
    };

    if (process.env.MAIL_MODE !== 'gmail') {
      respuesta.resetLink = resetLink;
    }

    return res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);

    return res.status(500).json({
      mensaje: 'Error interno al solicitar recuperación de contraseña.'
    });
  }
};

const restablecerPassword = async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    if (!token || !nuevaPassword) {
      return res.status(400).json({
        mensaje: 'Token y nueva contraseña son obligatorios.'
      });
    }

    if (nuevaPassword.length < 6) {
      return res.status(400).json({
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres.'
      });
    }

    const token_hash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const tokenRecuperacion = await buscarTokenRecuperacionValido(token_hash);

    if (!tokenRecuperacion) {
      return res.status(400).json({
        mensaje: 'El enlace de recuperación es inválido o ha expirado.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(nuevaPassword, salt);

    const usuarioActualizado = await actualizarPasswordUsuario({
      usuario_id: tokenRecuperacion.usuario_id,
      password_hash
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.'
      });
    }

    await marcarTokenRecuperacionUsado(tokenRecuperacion.token_id);

    return res.status(200).json({
      mensaje: 'Contraseña restablecida correctamente.'
    });

  } catch (error) {
    console.error('Error al restablecer contraseña:', error);

    return res.status(500).json({
      mensaje: 'Error interno al restablecer contraseña.'
    });
  }
};

const verificarEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        mensaje: 'Token de verificación obligatorio.'
      });
    }

    const token_hash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const tokenVerificacion = await buscarTokenVerificacionValido(token_hash);

    if (!tokenVerificacion) {
      return res.status(400).json({
        mensaje: 'El enlace de verificación es inválido o ha expirado.'
      });
    }

    const usuarioVerificado = await marcarEmailVerificado(
      tokenVerificacion.usuario_id
    );

    if (!usuarioVerificado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.'
      });
    }

    await marcarTokenVerificacionUsado(tokenVerificacion.token_id);

    return res.status(200).json({
      mensaje: 'Correo verificado correctamente. Ya puedes iniciar sesión.',
      usuario: usuarioVerificado
    });

  } catch (error) {
    console.error('Error al verificar correo:', error);

    return res.status(500).json({
      mensaje: 'Error interno al verificar correo.'
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  solicitarRecuperacionPassword,
  restablecerPassword,
  verificarEmail
};