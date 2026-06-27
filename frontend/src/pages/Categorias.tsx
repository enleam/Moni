import { useEffect, useState } from 'react';

import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias
} from '../services/categoriaService';

import { obtenerUsuarioLocal } from '../services/authService';

import type {
  Categoria,
  TipoCategoria
} from '../services/categoriaService';

import ConfirmDialog from '../components/ConfirmDialog';
import Sidebar from '../components/Sidebar';

function Categorias() {
  const usuario = obtenerUsuarioLocal();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoCategoria>('GASTO');
  const [color, setColor] = useState('#2563eb');
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      setError('');

      const data = await listarCategorias();
      setCategorias(data);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al cargar categorías.'
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setTipo('GASTO');
    setColor('#2563eb');
    setCategoriaEditando(null);
  };

  const handleGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMensaje('');
      setError('');

      if (!nombre.trim()) {
        setError('El nombre de la categoría es obligatorio.');
        return;
      }

      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.categoria_id, {
          nombre,
          tipo,
          color
        });

        setMensaje('Categoría actualizada correctamente.');
      } else {
        await crearCategoria({
          nombre,
          tipo,
          color
        });

        setMensaje('Categoría creada correctamente.');
      }

      limpiarFormulario();
      await cargarCategorias();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al guardar categoría.'
      );
    }
  };

  const handleEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNombre(categoria.nombre);
    setTipo(categoria.tipo);
    setColor(categoria.color || '#2563eb');
    setMensaje('');
    setError('');
  };

  const abrirDialogEliminar = (categoria: Categoria) => {
    setCategoriaAEliminar(categoria);
    setMensaje('');
    setError('');
  };

  const confirmarEliminarCategoria = async () => {
    if (!categoriaAEliminar) {
      return;
    }

    try {
      setEliminando(true);
      setMensaje('');
      setError('');

      await eliminarCategoria(categoriaAEliminar.categoria_id);

      setMensaje('Categoría eliminada correctamente.');
      setCategoriaAEliminar(null);

      await cargarCategorias();

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al eliminar categoría.'
      );
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const categoriasIngreso = categorias.filter(
    (categoria) => categoria.tipo === 'INGRESO'
  );

  const categoriasGasto = categorias.filter(
    (categoria) => categoria.tipo === 'GASTO'
  );

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Categorías</h1>
            <p>
              Gestiona tus categorías de ingresos y gastos, {usuario?.nombre || 'usuario'}.
            </p>
          </div>
        </header>

        <section className="categoria-layout">
          <div className="form-card">
            <h2>
              {categoriaEditando ? 'Editar categoría' : 'Nueva categoría'}
            </h2>

            <form onSubmit={handleGuardar}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ejemplo: Comida"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoCategoria)}
                >
                  <option value="GASTO">Gasto</option>
                  <option value="INGRESO">Ingreso</option>
                </select>
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              {mensaje && <p className="success-message">{mensaje}</p>}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">
                {categoriaEditando ? 'Actualizar' : 'Guardar'}
              </button>

              {categoriaEditando && (
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
              <h2>Listado de categorías</h2>
              {cargando && <span>Cargando...</span>}
            </div>

            <h3>Gastos</h3>

            {categoriasGasto.length === 0 ? (
              <p className="empty-text">No tienes categorías de gasto.</p>
            ) : (
              <div className="category-list">
                {categoriasGasto.map((categoria) => (
                  <div key={categoria.categoria_id} className="category-item">
                    <div className="category-info">
                      <span
                        className="category-color"
                        style={{ backgroundColor: categoria.color || '#2563eb' }}
                      />

                      <div>
                        <strong>{categoria.nombre}</strong>
                        <small>{categoria.tipo}</small>
                      </div>
                    </div>

                    <div className="category-actions">
                      <button onClick={() => handleEditar(categoria)}>
                        Editar
                      </button>

                      <button
                        className="danger-button"
                        onClick={() => abrirDialogEliminar(categoria)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3>Ingresos</h3>

            {categoriasIngreso.length === 0 ? (
              <p className="empty-text">No tienes categorías de ingreso.</p>
            ) : (
              <div className="category-list">
                {categoriasIngreso.map((categoria) => (
                  <div key={categoria.categoria_id} className="category-item">
                    <div className="category-info">
                      <span
                        className="category-color"
                        style={{ backgroundColor: categoria.color || '#2563eb' }}
                      />

                      <div>
                        <strong>{categoria.nombre}</strong>
                        <small>{categoria.tipo}</small>
                      </div>
                    </div>

                    <div className="category-actions">
                      <button onClick={() => handleEditar(categoria)}>
                        Editar
                      </button>

                      <button
                        className="danger-button"
                        onClick={() => abrirDialogEliminar(categoria)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmDialog
        abierto={!!categoriaAEliminar}
        titulo="Eliminar categoría"
        descripcion={
          categoriaAEliminar
            ? `¿Seguro que deseas eliminar la categoría "${categoriaAEliminar.nombre}"? Esta acción no borrará el registro de la base de datos, solo lo desactivará.`
            : ''
        }
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        tipo="danger"
        cargando={eliminando}
        onConfirmar={confirmarEliminarCategoria}
        onCerrar={() => setCategoriaAEliminar(null)}
      />
    </div>
  );
}

export default Categorias;