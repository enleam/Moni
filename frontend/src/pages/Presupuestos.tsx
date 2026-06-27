import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  actualizarPresupuesto,
  crearPresupuesto,
  eliminarPresupuesto,
  listarPresupuestos
} from '../services/presupuestoService';

import {
  listarCategorias
} from '../services/categoriaService';

import {
  obtenerUsuarioLocal
} from '../services/authService';

import type { Categoria } from '../services/categoriaService';
import type { Presupuesto } from '../services/presupuestoService';

import ConfirmDialog from '../components/ConfirmDialog';
import Sidebar from '../components/Sidebar';

function Presupuestos() {
  const usuario = obtenerUsuarioLocal();
  const fechaActual = new Date();

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [categoriaId, setCategoriaId] = useState('');
  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);
  const [montoPresupuestado, setMontoPresupuestado] = useState('');

  const [presupuestoEditando, setPresupuestoEditando] = useState<Presupuesto | null>(null);

  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState<Presupuesto | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  const categoriasGasto = useMemo(() => {
    return categorias.filter((categoria) => categoria.tipo === 'GASTO');
  }, [categorias]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');

      const [dataPresupuestos, dataCategorias] = await Promise.all([
        listarPresupuestos(anio, mes),
        listarCategorias()
      ]);

      setPresupuestos(dataPresupuestos);
      setCategorias(dataCategorias);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al cargar presupuestos.'
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setCategoriaId('');
    setMontoPresupuestado('');
    setPresupuestoEditando(null);
  };

  const handleGuardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMensaje('');
      setError('');

      if (!categoriaId) {
        setError('Debes seleccionar una categoría de gasto.');
        return;
      }

      if (!montoPresupuestado || Number(montoPresupuestado) <= 0) {
        setError('El monto presupuestado debe ser mayor a cero.');
        return;
      }

      const payload = {
        categoria_id: Number(categoriaId),
        anio,
        mes,
        monto_presupuestado: Number(montoPresupuestado)
      };

      if (presupuestoEditando) {
        await actualizarPresupuesto(
          presupuestoEditando.presupuesto_id,
          payload
        );

        setMensaje('Presupuesto actualizado correctamente.');
      } else {
        await crearPresupuesto(payload);

        setMensaje('Presupuesto registrado correctamente.');
      }

      limpiarFormulario();
      await cargarDatos();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al guardar presupuesto.'
      );
    }
  };

  const handleEditar = (presupuesto: Presupuesto) => {
    setPresupuestoEditando(presupuesto);
    setCategoriaId(String(presupuesto.categoria_id));
    setAnio(Number(presupuesto.anio));
    setMes(Number(presupuesto.mes));
    setMontoPresupuestado(String(presupuesto.monto_presupuestado));
    setMensaje('');
    setError('');
  };

  const abrirDialogEliminar = (presupuesto: Presupuesto) => {
    setPresupuestoAEliminar(presupuesto);
    setMensaje('');
    setError('');
  };

  const confirmarEliminarPresupuesto = async () => {
    if (!presupuestoAEliminar) {
      return;
    }

    try {
      setEliminando(true);
      setMensaje('');
      setError('');

      await eliminarPresupuesto(presupuestoAEliminar.presupuesto_id);

      setMensaje('Presupuesto eliminado correctamente.');
      setPresupuestoAEliminar(null);

      await cargarDatos();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al eliminar presupuesto.'
      );
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [anio, mes]);

  const totalPresupuestado = presupuestos.reduce(
    (total, item) => total + Number(item.monto_presupuestado),
    0
  );

  const totalGastado = presupuestos.reduce(
    (total, item) => total + Number(item.monto_gastado),
    0
  );

  const totalDisponible = totalPresupuestado - totalGastado;

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header dashboard-header-row">
          <div>
            <h1>Presupuestos</h1>
            <p>
              Controla tus límites mensuales por categoría, {usuario?.nombre || 'usuario'}.
            </p>
          </div>

          <div className="dashboard-filters">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
            >
              {meses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={anio}
              min="2000"
              onChange={(e) => setAnio(Number(e.target.value))}
            />
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Total presupuestado</span>
            <strong>S/ {totalPresupuestado.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Total gastado</span>
            <strong>S/ {totalGastado.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Total disponible</span>
            <strong>S/ {totalDisponible.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Categorías presupuestadas</span>
            <strong>{presupuestos.length}</strong>
          </div>
        </section>

        <section className="presupuesto-layout">
          <div className="form-card">
            <h2>
              {presupuestoEditando ? 'Editar presupuesto' : 'Nuevo presupuesto'}
            </h2>

            <form onSubmit={handleGuardar}>
              <div className="form-group">
                <label>Categoría de gasto</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Selecciona una categoría</option>

                  {categoriasGasto.map((categoria) => (
                    <option
                      key={categoria.categoria_id}
                      value={categoria.categoria_id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Monto presupuestado</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={montoPresupuestado}
                  onChange={(e) => setMontoPresupuestado(e.target.value)}
                  placeholder="Ejemplo: 500"
                  required
                />
              </div>

              {mensaje && <p className="success-message">{mensaje}</p>}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">
                {presupuestoEditando ? 'Actualizar' : 'Guardar'}
              </button>

              {presupuestoEditando && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}
            </form>
          </div>

          <div className="list-card">
            <div className="list-header">
              <h2>Presupuestos del periodo</h2>
              {cargando && <span>Cargando...</span>}
            </div>

            {presupuestos.length === 0 ? (
              <p className="empty-text">
                No tienes presupuestos registrados para este periodo.
              </p>
            ) : (
              <div className="budget-list">
                {presupuestos.map((presupuesto) => {
                  const porcentaje = Number(presupuesto.porcentaje_usado);
                  const excedido = porcentaje > 100;

                  return (
                    <div
                      key={presupuesto.presupuesto_id}
                      className="budget-item"
                    >
                      <div className="budget-header">
                        <div className="category-info">
                          <span
                            className="category-color"
                            style={{
                              backgroundColor:
                                presupuesto.categoria_color || '#2563eb'
                            }}
                          />

                          <div>
                            <strong>{presupuesto.categoria_nombre}</strong>
                            <small>
                              {presupuesto.mes}/{presupuesto.anio}
                            </small>
                          </div>
                        </div>

                        <strong className={excedido ? 'amount-expense' : ''}>
                          {porcentaje.toFixed(1)}%
                        </strong>
                      </div>

                      <div className="budget-progress">
                        <div
                          className={
                            excedido
                              ? 'budget-progress-fill exceeded'
                              : 'budget-progress-fill'
                          }
                          style={{
                            width: `${Math.min(porcentaje, 100)}%`
                          }}
                        />
                      </div>

                      <div className="budget-values">
                        <span>
                          Presupuesto: S/ {Number(presupuesto.monto_presupuestado).toFixed(2)}
                        </span>

                        <span>
                          Gastado: S/ {Number(presupuesto.monto_gastado).toFixed(2)}
                        </span>

                        <span>
                          Disponible: S/ {Number(presupuesto.monto_disponible).toFixed(2)}
                        </span>
                      </div>

                      {excedido && (
                        <p className="budget-alert">
                          Has superado el presupuesto de esta categoría.
                        </p>
                      )}

                      <div className="category-actions">
                        <button onClick={() => handleEditar(presupuesto)}>
                          Editar
                        </button>

                        <button
                          className="danger-button"
                          onClick={() => abrirDialogEliminar(presupuesto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmDialog
        abierto={!!presupuestoAEliminar}
        titulo="Eliminar presupuesto"
        descripcion={
          presupuestoAEliminar
            ? `¿Seguro que deseas eliminar el presupuesto de "${presupuestoAEliminar.categoria_nombre}" por S/ ${Number(presupuestoAEliminar.monto_presupuestado).toFixed(2)}? Esta acción solo lo desactivará.`
            : ''
        }
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        tipo="danger"
        cargando={eliminando}
        onConfirmar={confirmarEliminarPresupuesto}
        onCerrar={() => setPresupuestoAEliminar(null)}
      />
    </div>
  );
}

export default Presupuestos;