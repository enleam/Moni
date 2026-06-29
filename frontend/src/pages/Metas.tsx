import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';

import {
  actualizarMeta,
  crearMeta,
  eliminarMeta,
  listarMetas,
  registrarAvanceMeta
} from '../services/metaService';

import type { MetaAhorro } from '../services/metaService';

function Metas() {
  const [metas, setMetas] = useState<MetaAhorro[]>([]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [montoActual, setMontoActual] = useState('0');
  const [fechaObjetivo, setFechaObjetivo] = useState('');

  const [metaEditando, setMetaEditando] = useState<MetaAhorro | null>(null);
  const [metaAEliminar, setMetaAEliminar] = useState<MetaAhorro | null>(null);
  const [metaAvance, setMetaAvance] = useState<MetaAhorro | null>(null);
  const [montoAvance, setMontoAvance] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [registrandoAvance, setRegistrandoAvance] = useState(false);

  const cargarMetas = async () => {
    try {
      setCargando(true);
      setError('');

      const data = await listarMetas();
      setMetas(data);
    } catch (error: any) {
      setError(error.response?.data?.mensaje || 'Error al cargar metas.');
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setMontoObjetivo('');
    setMontoActual('0');
    setFechaObjetivo('');
    setMetaEditando(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setMensaje('');
      setError('');

      const montoObjetivoNumero = Number(montoObjetivo);
      const montoActualNumero = Number(montoActual || 0);

      if (!nombre.trim()) {
        setError('El nombre de la meta es obligatorio.');
        return;
      }

      if (montoObjetivoNumero <= 0 || Number.isNaN(montoObjetivoNumero)) {
        setError('El monto objetivo debe ser mayor a 0.');
        return;
      }

      if (montoActualNumero < 0 || Number.isNaN(montoActualNumero)) {
        setError('El monto actual no puede ser negativo.');
        return;
      }

      if (montoActualNumero > montoObjetivoNumero) {
        setError('El monto actual no puede superar el monto objetivo.');
        return;
      }

      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        monto_objetivo: montoObjetivoNumero,
        monto_actual: montoActualNumero,
        fecha_objetivo: fechaObjetivo || undefined
      };

      if (metaEditando) {
        await actualizarMeta(metaEditando.meta_id, payload);
        setMensaje('Meta actualizada correctamente.');
      } else {
        await crearMeta(payload);
        setMensaje('Meta creada correctamente.');
      }

      limpiarFormulario();
      await cargarMetas();
    } catch (error: any) {
      setError(error.response?.data?.mensaje || 'Error al guardar meta.');
    } finally {
      setGuardando(false);
    }
  };

  const editarMeta = (meta: MetaAhorro) => {
    setMetaEditando(meta);
    setNombre(meta.nombre);
    setDescripcion(meta.descripcion || '');
    setMontoObjetivo(String(Number(meta.monto_objetivo)));
    setMontoActual(String(Number(meta.monto_actual)));
    setFechaObjetivo(meta.fecha_objetivo ? meta.fecha_objetivo.slice(0, 10) : '');
    setMensaje('');
    setError('');
  };

  const abrirAvance = (meta: MetaAhorro) => {
    setMetaAvance(meta);
    setMontoAvance('');
    setMensaje('');
    setError('');
  };

  const confirmarAvance = async () => {
    if (!metaAvance) return;

    try {
      setRegistrandoAvance(true);
      setMensaje('');
      setError('');

      const montoAvanceNumero = Number(montoAvance);

      if (montoAvanceNumero <= 0 || Number.isNaN(montoAvanceNumero)) {
        setError('El avance debe ser mayor a 0.');
        return;
      }

      await registrarAvanceMeta(metaAvance.meta_id, montoAvanceNumero);

      setMensaje('Avance registrado correctamente.');
      setMetaAvance(null);
      setMontoAvance('');

      await cargarMetas();
    } catch (error: any) {
      setError(error.response?.data?.mensaje || 'Error al registrar avance.');
    } finally {
      setRegistrandoAvance(false);
    }
  };

  const confirmarEliminarMeta = async () => {
    if (!metaAEliminar) return;

    try {
      setEliminando(true);
      setMensaje('');
      setError('');

      await eliminarMeta(metaAEliminar.meta_id);

      setMensaje('Meta eliminada correctamente.');
      setMetaAEliminar(null);

      await cargarMetas();
    } catch (error: any) {
      setError(error.response?.data?.mensaje || 'Error al eliminar meta.');
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarMetas();
  }, []);

  const resumen = useMemo(() => {
    const totalObjetivo = metas.reduce(
      (total, meta) => total + Number(meta.monto_objetivo),
      0
    );

    const totalAhorrado = metas.reduce(
      (total, meta) => total + Number(meta.monto_actual),
      0
    );

    const activas = metas.filter((meta) => meta.estado === 'ACTIVA').length;
    const completadas = metas.filter((meta) => meta.estado === 'COMPLETADA').length;

    return {
      totalObjetivo,
      totalAhorrado,
      activas,
      completadas
    };
  }, [metas]);

  const calcularProgreso = (meta: MetaAhorro) => {
    const objetivo = Number(meta.monto_objetivo);
    const actual = Number(meta.monto_actual);

    if (objetivo <= 0) return 0;

    return Math.min((actual / objetivo) * 100, 100);
  };

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return 'Sin fecha objetivo';

    return new Date(fecha).toLocaleDateString('es-PE');
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Metas de ahorro</h1>
            <p>Define objetivos financieros y registra tus avances.</p>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Total objetivo</span>
            <strong>S/ {resumen.totalObjetivo.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Total ahorrado</span>
            <strong>S/ {resumen.totalAhorrado.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Metas activas</span>
            <strong>{resumen.activas}</strong>
          </div>

          <div className="kpi-card">
            <span>Metas completadas</span>
            <strong>{resumen.completadas}</strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-card">
            <h2>{metaEditando ? 'Editar meta' : 'Nueva meta'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Laptop, viaje, fondo de emergencia"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción opcional"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Monto objetivo</label>
                <input
                  type="number"
                  value={montoObjetivo}
                  onChange={(e) => setMontoObjetivo(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Monto actual</label>
                <input
                  type="number"
                  value={montoActual}
                  onChange={(e) => setMontoActual(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Fecha objetivo</label>
                <input
                  type="date"
                  value={fechaObjetivo}
                  onChange={(e) => setFechaObjetivo(e.target.value)}
                />
              </div>

              {mensaje && <p className="success-message">{mensaje}</p>}
              {error && <p className="error-message">{error}</p>}

              <button type="submit" disabled={guardando}>
                {guardando
                  ? 'Guardando...'
                  : metaEditando
                    ? 'Actualizar meta'
                    : 'Crear meta'}
              </button>

              {metaEditando && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={limpiarFormulario}
                  disabled={guardando}
                >
                  Cancelar edición
                </button>
              )}
            </form>
          </div>

          <div className="table-card">
            <h2>Mis metas</h2>

            {cargando && (
              <p className="empty-text">Cargando metas...</p>
            )}

            {!cargando && metas.length === 0 && (
              <p className="empty-text">
                Todavía no tienes metas de ahorro registradas.
              </p>
            )}

            <div className="metas-list">
              {metas.map((meta) => {
                const progreso = calcularProgreso(meta);

                return (
                  <div key={meta.meta_id} className="meta-card">
                    <div className="meta-card-header">
                      <div>
                        <h3>{meta.nombre}</h3>
                        <p>{meta.descripcion || 'Sin descripción'}</p>
                      </div>

                      <span
                        className={
                          meta.estado === 'COMPLETADA'
                            ? 'status-badge completed'
                            : 'status-badge active'
                        }
                      >
                        {meta.estado}
                      </span>
                    </div>

                    <div className="meta-amounts">
                      <span>
                        S/ {Number(meta.monto_actual).toFixed(2)}
                      </span>
                      <span>
                        de S/ {Number(meta.monto_objetivo).toFixed(2)}
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>

                    <div className="meta-footer">
                      <span>{progreso.toFixed(1)}%</span>
                      <span>{formatearFecha(meta.fecha_objetivo)}</span>
                    </div>

                    <div className="meta-actions">
                        <button
                            type="button"
                            className="meta-action-button edit"
                            onClick={() => editarMeta(meta)}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="meta-action-button progress"
                            onClick={() => abrirAvance(meta)}
                            disabled={meta.estado === 'COMPLETADA'}
                        >
                            Avance
                        </button>

                        <button
                            type="button"
                            className="meta-action-button delete"
                            onClick={() => setMetaAEliminar(meta)}
                        >
                            Eliminar
                        </button>
                        </div>
                    </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <ConfirmDialog
        abierto={!!metaAEliminar}
        titulo="Eliminar meta"
        descripcion={
          metaAEliminar
            ? `¿Seguro que deseas eliminar la meta "${metaAEliminar.nombre}"? Esta acción solo la desactivará.`
            : ''
        }
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        tipo="danger"
        cargando={eliminando}
        onConfirmar={confirmarEliminarMeta}
        onCerrar={() => setMetaAEliminar(null)}
      />

      {metaAvance && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">+</div>

            <h2>Registrar avance</h2>

            <p>
              Agrega un monto ahorrado para la meta "{metaAvance.nombre}".
            </p>

            <div className="form-group">
              <label>Monto de avance</label>
              <input
                type="number"
                value={montoAvance}
                onChange={(e) => setMontoAvance(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel"
                onClick={() => setMetaAvance(null)}
                disabled={registrandoAvance}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="confirm-button"
                onClick={confirmarAvance}
                disabled={registrandoAvance}
              >
                {registrandoAvance ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Metas;