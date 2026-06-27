import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  restablecerPassword
} from '../services/authService';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCargando(true);
      setMensaje('');
      setError('');

      if (!token) {
        setError('El enlace de recuperación no es válido.');
        return;
      }

      if (nuevaPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (nuevaPassword !== confirmarPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      const response = await restablecerPassword({
        token,
        nuevaPassword
      });

      setMensaje(response.mensaje);

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje ||
        'Error al restablecer contraseña.'
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
        <h2>Nueva contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
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

          {mensaje && <p className="success-message">{mensaje}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;