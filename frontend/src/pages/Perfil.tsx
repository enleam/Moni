import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import Sidebar from '../components/Sidebar';

import {
  actualizarPerfil,
  cambiarPassword,
  obtenerPerfil
} from '../services/perfilService';

import type { PerfilUsuario } from '../services/perfilService';

function Perfil() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);

  const [nombre, setNombre] = useState('');

  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [mensajePerfil, setMensajePerfil] = useState('');
  const [errorPerfil, setErrorPerfil] = useState('');

  const [mensajePassword, setMensajePassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const cargarPerfil = async () => {
    try {
      setCargandoPerfil(true);
      setErrorPerfil('');

      const data = await obtenerPerfil();

      setPerfil(data);
      setNombre(data.nombre);

      localStorage.setItem('usuario', JSON.stringify(data));

    } catch (error: any) {
      setErrorPerfil(
        error.response?.data?.mensaje || 'Error al cargar perfil.'
      );
    } finally {
      setCargandoPerfil(false);
    }
  };

  const handleActualizarPerfil = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setGuardandoPerfil(true);
      setMensajePerfil('');
      setErrorPerfil('');

      if (!nombre.trim()) {
        setErrorPerfil('El nombre es obligatorio.');
        return;
      }

      if (nombre.trim().length < 2) {
        setErrorPerfil('El nombre debe tener al menos 2 caracteres.');
        return;
      }

      const perfilActualizado = await actualizarPerfil({
        nombre: nombre.trim()
      });

      setPerfil(perfilActualizado);
      setNombre(perfilActualizado.nombre);
      localStorage.setItem('usuario', JSON.stringify(perfilActualizado));

      setMensajePerfil('Perfil actualizado correctamente.');

    } catch (error: any) {
      setErrorPerfil(
        error.response?.data?.mensaje || 'Error al actualizar perfil.'
      );
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handleCambiarPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCambiandoPassword(true);
      setMensajePassword('');
      setErrorPassword('');

      if (!passwordActual || !nuevaPassword || !confirmarPassword) {
        setErrorPassword('Completa todos los campos de contraseña.');
        return;
      }

      if (nuevaPassword.length < 6) {
        setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (nuevaPassword !== confirmarPassword) {
        setErrorPassword('Las contraseñas no coinciden.');
        return;
      }

      const response = await cambiarPassword({
        passwordActual,
        nuevaPassword
      });

      setMensajePassword(response.mensaje);
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');

    } catch (error: any) {
      setErrorPassword(
        error.response?.data?.mensaje || 'Error al cambiar contraseña.'
      );
    } finally {
      setCambiandoPassword(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const fechaRegistro = perfil?.fecha_registro
    ? new Date(perfil.fecha_registro).toLocaleDateString('es-PE')
    : '-';

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Perfil</h1>
            <p>Administra tus datos personales y la seguridad de tu cuenta.</p>
          </div>
        </header>

        {cargandoPerfil && (
          <p className="empty-text">Cargando información del perfil...</p>
        )}

        <section className="perfil-layout">
          <div className="form-card">
            <h2>Datos personales</h2>

            <form onSubmit={handleActualizarPerfil}>
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
                  value={perfil?.correo || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Fecha de registro</label>
                <input
                  type="text"
                  value={fechaRegistro}
                  disabled
                />
              </div>

              {mensajePerfil && (
                <p className="success-message">{mensajePerfil}</p>
              )}

              {errorPerfil && (
                <p className="error-message">{errorPerfil}</p>
              )}

              <button type="submit" disabled={guardandoPerfil}>
                {guardandoPerfil ? 'Guardando...' : 'Actualizar perfil'}
              </button>
            </form>
          </div>

          <div className="form-card">
            <h2>Seguridad</h2>

            <form onSubmit={handleCambiarPassword}>
              <div className="form-group">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
              </div>

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
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                  minLength={6}
                />
              </div>

              {mensajePassword && (
                <p className="success-message">{mensajePassword}</p>
              )}

              {errorPassword && (
                <p className="error-message">{errorPassword}</p>
              )}

              <button type="submit" disabled={cambiandoPassword}>
                {cambiandoPassword ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;