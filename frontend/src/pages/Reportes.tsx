import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  obtenerReporteMensual
} from '../services/reporteService';

import {
  cerrarSesion,
  obtenerUsuarioLocal
} from '../services/authService';

import type {
  ReporteMensual,
  TipoReporte
} from '../services/reporteService';

function Reportes() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioLocal();
  const fechaActual = new Date();

  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);
  const [tipo, setTipo] = useState<TipoReporte>('TODOS');

  const [reporte, setReporte] = useState<ReporteMensual | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

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

  const cargarReporte = async () => {
    try {
      setCargando(true);
      setError('');

      const data = await obtenerReporteMensual(anio, mes, tipo);
      setReporte(data);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al cargar reporte.'
      );
    } finally {
      setCargando(false);
    }
  };

  const convertirCSV = () => {
    if (!reporte || reporte.movimientos.length === 0) {
      return '';
    }

    const encabezados = [
      'ID',
      'Fecha',
      'Tipo',
      'Categoria',
      'Monto',
      'Metodo de pago',
      'Descripcion'
    ];

    const filas = reporte.movimientos.map((movimiento) => [
      movimiento.movimiento_id,
      movimiento.fecha,
      movimiento.tipo,
      movimiento.categoria,
      Number(movimiento.monto).toFixed(2),
      movimiento.metodo_pago || '',
      movimiento.descripcion || ''
    ]);

    const limpiarValor = (valor: string | number) => {
      const texto = String(valor).replace(/"/g, '""');
      return `"${texto}"`;
    };

    return [
      encabezados.map(limpiarValor).join(','),
      ...filas.map((fila) => fila.map(limpiarValor).join(','))
    ].join('\n');
  };

  const exportarCSV = () => {
    if (!reporte || reporte.movimientos.length === 0) {
      setError('No hay movimientos para exportar.');
      return;
    }

    const csv = convertirCSV();
    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = `reporte_fintrack_${anio}_${mes}_${tipo}.csv`;
    enlace.click();

    URL.revokeObjectURL(url);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  useEffect(() => {
    cargarReporte();
  }, [anio, mes, tipo]);

  const resumen = reporte?.resumen;

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>FinTrack</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/movimientos">Movimientos</Link>
          <Link to="/presupuestos">Presupuestos</Link>
          <Link to="/reportes">Reportes</Link>
        </nav>

        <button onClick={handleCerrarSesion} className="logout-button">
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header dashboard-header-row">
          <div>
            <h1>Reportes</h1>
            <p>
              Consulta y exporta tus movimientos mensuales, {usuario?.nombre || 'usuario'}.
            </p>
          </div>

          <button
            type="button"
            className="export-button"
            onClick={exportarCSV}
          >
            Exportar CSV
          </button>
        </header>

        <section className="report-filter-card">
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

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoReporte)}
            >
              <option value="TODOS">Todos</option>
              <option value="INGRESO">Solo ingresos</option>
              <option value="GASTO">Solo gastos</option>
            </select>
          </div>
        </section>

        {error && <p className="error-message">{error}</p>}

        {cargando && (
          <p className="empty-text">Cargando reporte mensual...</p>
        )}

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Total ingresos</span>
            <strong>S/ {Number(resumen?.total_ingresos || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Total gastos</span>
            <strong>S/ {Number(resumen?.total_gastos || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Balance</span>
            <strong>S/ {Number(resumen?.balance || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Movimientos</span>
            <strong>{Number(resumen?.cantidad_movimientos || 0)}</strong>
          </div>
        </section>

        <section className="kpi-grid report-extra-kpis">
          <div className="kpi-card">
            <span>Promedio por movimiento</span>
            <strong>S/ {Number(resumen?.promedio_movimiento || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Mayor movimiento</span>
            <strong>S/ {Number(resumen?.mayor_movimiento || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Menor movimiento</span>
            <strong>S/ {Number(resumen?.menor_movimiento || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Filtro aplicado</span>
            <strong>{tipo}</strong>
          </div>
        </section>

        <section className="report-layout">
          <div className="list-card">
            <h2>Movimientos del periodo</h2>

            {!reporte || reporte.movimientos.length === 0 ? (
              <p className="empty-text">
                No hay movimientos para este filtro.
              </p>
            ) : (
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Categoría</th>
                      <th>Método</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporte.movimientos.map((movimiento) => (
                      <tr key={movimiento.movimiento_id}>
                        <td>{movimiento.fecha}</td>

                        <td>
                          <span
                            className={
                              movimiento.tipo === 'INGRESO'
                                ? 'badge-income'
                                : 'badge-expense'
                            }
                          >
                            {movimiento.tipo}
                          </span>
                        </td>

                        <td>
                          <span
                            className="category-color"
                            style={{
                              backgroundColor:
                                movimiento.categoria_color || '#2563eb'
                            }}
                          />

                          {' '}
                          {movimiento.categoria}
                        </td>

                        <td>{movimiento.metodo_pago || '-'}</td>
                        <td>{movimiento.descripcion || '-'}</td>

                        <td
                          className={
                            movimiento.tipo === 'INGRESO'
                              ? 'amount-income'
                              : 'amount-expense'
                          }
                        >
                          {movimiento.tipo === 'INGRESO' ? '+' : '-'} S/ {' '}
                          {Number(movimiento.monto).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="list-card">
            <h2>Totales por categoría</h2>

            {!reporte || reporte.totales_por_categoria.length === 0 ? (
              <p className="empty-text">
                No hay categorías para mostrar.
              </p>
            ) : (
              <div className="category-total-list">
                {reporte.totales_por_categoria.map((item) => (
                  <div
                    className="category-total-item"
                    key={`${item.categoria}-${item.tipo}`}
                  >
                    <div>
                      <strong>{item.categoria}</strong>
                      <small>
                        {item.tipo} · {item.cantidad} movimiento(s)
                      </small>
                    </div>

                    <strong
                      className={
                        item.tipo === 'INGRESO'
                          ? 'amount-income'
                          : 'amount-expense'
                      }
                    >
                      S/ {Number(item.total).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reportes;