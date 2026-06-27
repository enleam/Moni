import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  actualizarMovimiento,
  crearMovimiento,
  eliminarMovimiento,
  listarMovimientos
} from '../services/movimientoService';

import {
  listarCategorias
} from '../services/categoriaService';

import {
  obtenerUsuarioLocal
} from '../services/authService';

import type {
  Movimiento,
  TipoMovimiento
} from '../services/movimientoService';

import type {
  Categoria
} from '../services/categoriaService';

import ConfirmDialog from '../components/ConfirmDialog';
import Sidebar from '../components/Sidebar';

function Movimientos() {
  const usuario = obtenerUsuarioLocal();

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [tipo, setTipo] = useState<TipoMovimiento>('GASTO');
  const [categoriaId, setCategoriaId] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  const [movimientoEditando, setMovimientoEditando] =
    useState<Movimiento | null>(null);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const [movimientoAEliminar, setMovimientoAEliminar] =
    useState<Movimiento | null>(null);

  const [eliminando, setEliminando] = useState(false);

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((categoria) => categoria.tipo === tipo);
  }, [categorias, tipo]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');

      const [dataMovimientos, dataCategorias] = await Promise.all([
        listarMovimientos(),
        listarCategorias()
      ]);

      setMovimientos(dataMovimientos);
      setCategorias(dataCategorias);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al cargar datos.'
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setTipo('GASTO');
    setCategoriaId('');
    setMonto('');
    setFecha('');
    setDescripcion('');
    setMetodoPago('Efectivo');
    setMovimientoEditando(null);
  };

  const handleCambiarTipo = (nuevoTipo: TipoMovimiento) => {
    setTipo(nuevoTipo);
    setCategoriaId('');
  };

  const handleGuardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMensaje('');
      setError('');

      if (!categoriaId) {
        setError('Debes seleccionar una categoría.');
        return;
      }

      if (!monto || Number(monto) <= 0) {
        setError('El monto debe ser mayor a cero.');
        return;
      }

      if (!fecha) {
        setError('La fecha es obligatoria.');
        return;
      }

      const payload = {
        categoria_id: Number(categoriaId),
        tipo,
        monto: Number(monto),
        fecha,
        descripcion,
        metodo_pago: metodoPago
      };

      if (movimientoEditando) {
        await actualizarMovimiento(
          movimientoEditando.movimiento_id,
          payload
        );

        setMensaje('Movimiento actualizado correctamente.');
      } else {
        await crearMovimiento(payload);

        setMensaje('Movimiento registrado correctamente.');
      }

      limpiarFormulario();
      await cargarDatos();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al guardar movimiento.'
      );
    }
  };

  const handleEditar = (movimiento: Movimiento) => {
    setMovimientoEditando(movimiento);
    setTipo(movimiento.tipo);
    setCategoriaId(String(movimiento.categoria_id));
    setMonto(String(movimiento.monto));
    setFecha(String(movimiento.fecha).substring(0, 10));
    setDescripcion(movimiento.descripcion || '');
    setMetodoPago(movimiento.metodo_pago || 'Efectivo');
    setMensaje('');
    setError('');
  };

  const abrirDialogEliminar = (movimiento: Movimiento) => {
    setMovimientoAEliminar(movimiento);
    setMensaje('');
    setError('');
  };

  const confirmarEliminarMovimiento = async () => {
    if (!movimientoAEliminar) {
      return;
    }

    try {
      setEliminando(true);
      setMensaje('');
      setError('');

      await eliminarMovimiento(movimientoAEliminar.movimiento_id);

      setMensaje('Movimiento eliminado correctamente.');
      setMovimientoAEliminar(null);

      await cargarDatos();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al eliminar movimiento.'
      );
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const totalIngresos = movimientos
    .filter((movimiento) => movimiento.tipo === 'INGRESO')
    .reduce((total, movimiento) => total + Number(movimiento.monto), 0);

  const totalGastos = movimientos
    .filter((movimiento) => movimiento.tipo === 'GASTO')
    .reduce((total, movimiento) => total + Number(movimiento.monto), 0);

  const balance = totalIngresos - totalGastos;

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Movimientos</h1>
            <p>
              Registra ingresos y gastos personales, {usuario?.nombre || 'usuario'}.
            </p>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Total ingresos</span>
            <strong>S/ {totalIngresos.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Total gastos</span>
            <strong>S/ {totalGastos.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Balance</span>
            <strong>S/ {balance.toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Movimientos</span>
            <strong>{movimientos.length}</strong>
          </div>
        </section>

        <section className="movimiento-layout">
          <div className="form-card">
            <h2>
              {movimientoEditando ? 'Editar movimiento' : 'Nuevo movimiento'}
            </h2>

            <form onSubmit={handleGuardar}>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) =>
                    handleCambiarTipo(e.target.value as TipoMovimiento)
                  }
                >
                  <option value="GASTO">Gasto</option>
                  <option value="INGRESO">Ingreso</option>
                </select>
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Selecciona una categoría</option>

                  {categoriasFiltradas.map((categoria) => (
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
                <label>Monto</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ejemplo: 25.50"
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Método de pago</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Yape/Plin">Yape/Plin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalle del movimiento"
                />
              </div>

              {mensaje && <p className="success-message">{mensaje}</p>}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">
                {movimientoEditando ? 'Actualizar' : 'Guardar'}
              </button>

              {movimientoEditando && (
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
              <h2>Últimos movimientos</h2>
              {cargando && <span>Cargando...</span>}
            </div>

            {movimientos.length === 0 ? (
              <p className="empty-text">
                Todavía no tienes movimientos registrados.
              </p>
            ) : (
              <div className="movement-list">
                {movimientos.map((movimiento) => (
                  <div
                    key={movimiento.movimiento_id}
                    className="movement-item"
                  >
                    <div className="movement-main">
                      <span
                        className="category-color"
                        style={{
                          backgroundColor:
                            movimiento.categoria_color || '#2563eb'
                        }}
                      />

                      <div>
                        <strong>{movimiento.categoria_nombre}</strong>
                        <small>
                          {String(movimiento.fecha).substring(0, 10)} · {' '}
                          {movimiento.metodo_pago || 'Sin método'}
                        </small>

                        {movimiento.descripcion && (
                          <p>{movimiento.descripcion}</p>
                        )}
                      </div>
                    </div>

                    <div className="movement-side">
                      <strong
                        className={
                          movimiento.tipo === 'INGRESO'
                            ? 'amount-income'
                            : 'amount-expense'
                        }
                      >
                        {movimiento.tipo === 'INGRESO' ? '+' : '-'} S/ {' '}
                        {Number(movimiento.monto).toFixed(2)}
                      </strong>

                      <div className="category-actions">
                        <button onClick={() => handleEditar(movimiento)}>
                          Editar
                        </button>

                        <button
                          className="danger-button"
                          onClick={() => abrirDialogEliminar(movimiento)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmDialog
          abierto={!!movimientoAEliminar}
          titulo="Eliminar movimiento"
          descripcion={
            movimientoAEliminar
              ? `¿Seguro que deseas eliminar este movimiento de ${movimientoAEliminar.tipo === 'INGRESO' ? 'ingreso' : 'gasto'} por S/ ${Number(movimientoAEliminar.monto).toFixed(2)}? Esta acción solo lo desactivará.`
              : ''
          }
          textoConfirmar="Eliminar"
          textoCancelar="Cancelar"
          tipo="danger"
          cargando={eliminando}
          onConfirmar={confirmarEliminarMovimiento}
          onCerrar={() => setMovimientoAEliminar(null)}
        />
    </div>
  );
}

export default Movimientos;