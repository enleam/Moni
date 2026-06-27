import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  solicitarRecuperacionPassword
} from '../services/authService';

function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCargando(true);
      setMensaje('');
      setError('');
      setResetLink('');

      const response = await solicitarRecuperacionPassword(correo);

      setMensaje(response.mensaje);

      if (response.resetLink) {
        setResetLink(response.resetLink);
      }

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje ||
        'Error al solicitar recuperación de contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Moni</h1>
        <p className="auth-subtitle">Gestión de gastos personales</p>
        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo registrado</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          {mensaje && <p className="success-message">{mensaje}</p>}
          {error && <p className="error-message">{error}</p>}

          {resetLink && (
            <div className="dev-reset-box">
              <strong>Modo desarrollo</strong>
              <p>
                Copia este enlace o haz clic para restablecer tu contraseña:
              </p>

              <a href={resetLink}>
                {resetLink}
              </a>
            </div>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Generando enlace...' : 'Enviar enlace'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;