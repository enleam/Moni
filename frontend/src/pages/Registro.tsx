import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { registrarUsuario } from '../services/authService';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [verificationLink, setVerificationLink] = useState('');

  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCargando(true);
      setMensaje('');
      setError('');
      setVerificationLink('');

      if (!nombre.trim() || !correo.trim() || !password || !confirmarPassword) {
        setError('Completa todos los campos.');
        return;
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (password !== confirmarPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      const response = await registrarUsuario({
        nombre: nombre.trim(),
        correo: correo.trim(),
        password
      });

      setMensaje(response.mensaje);
      setVerificationLink(response.verificationLink || '');

      setNombre('');
      setCorreo('');
      setPassword('');
      setConfirmarPassword('');

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al registrar usuario.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo-link">
          <h1>Moni</h1>
        </Link>

        <p className="auth-subtitle">Gestión de gastos personales</p>
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              minLength={6}
            />
          </div>

          {mensaje && (
            <p className="success-message">{mensaje}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {verificationLink && (
            <div className="dev-reset-box">
              <strong>Link de verificación en modo desarrollo:</strong>
              <p>
                Usa este enlace solo para pruebas locales.
              </p>
              <a href={verificationLink}>
                {verificationLink}
              </a>
            </div>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;