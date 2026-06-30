import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { verificarEmail } from '../services/authService';

function VerificarEmail() {
  const { token } = useParams();

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const confirmarEmail = async () => {
      try {
        setCargando(true);
        setMensaje('');
        setError('');

        if (!token) {
          setError('Token de verificación no encontrado.');
          return;
        }

        const response = await verificarEmail(token);

        setMensaje(response.mensaje);
      } catch (error: any) {
        setError(
          error.response?.data?.mensaje ||
          'Error al verificar el correo.'
        );
      } finally {
        setCargando(false);
      }
    };

    confirmarEmail();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Moni</h1>
        <p className="auth-subtitle">Verificación de correo</p>

        {cargando && (
          <p className="empty-text">Verificando tu cuenta...</p>
        )}

        {mensaje && (
          <p className="success-message">{mensaje}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        <p className="auth-link">
          <Link to="/login">Ir a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default VerificarEmail;