const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  buscarUsuarioPorCorreo,
  crearUsuario,
  buscarUsuarioPorId
} = require('../models/auth.model');

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

    const usuarioExistente = await buscarUsuarioPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'El correo ya está registrado.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await crearUsuario({
      nombre,
      correo,
      password_hash
    });

    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente.',
      token,
      usuario: nuevoUsuario
    });

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

    const usuario = await buscarUsuarioPorCorreo(correo);

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

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
};