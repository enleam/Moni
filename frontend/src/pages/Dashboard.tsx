import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import {
  cerrarSesion,
  obtenerPerfil,
  obtenerUsuarioLocal
} from '../services/authService';

import {
  obtenerEvolucionGastos,
  obtenerGastosPorCategoria,
  obtenerIngresosVsGastos,
  obtenerResumenDashboard
} from '../services/dashboardService';

import type { Usuario } from '../services/authService';

import type {
  DashboardResumen,
  EvolucionGasto,
  GastoCategoria,
  IngresoVsGasto
} from '../services/dashboardService';

function Dashboard() {
  const navigate = useNavigate();

  const fechaActual = new Date();

  const [usuario, setUsuario] = useState<Usuario | null>(
    obtenerUsuarioLocal()
  );

  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);

  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [gastosCategoria, setGastosCategoria] = useState<GastoCategoria[]>([]);
  const [ingresosVsGastos, setIngresosVsGastos] = useState<IngresoVsGasto[]>([]);
  const [evolucionGastos, setEvolucionGastos] = useState<EvolucionGasto[]>([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      setError('');

      const [
        resumenData,
        gastosCategoriaData,
        ingresosVsGastosData,
        evolucionGastosData
      ] = await Promise.all([
        obtenerResumenDashboard(anio, mes),
        obtenerGastosPorCategoria(anio, mes),
        obtenerIngresosVsGastos(),
        obtenerEvolucionGastos(anio, mes)
      ]);

      setResumen(resumenData);
      setGastosCategoria(gastosCategoriaData);
      setIngresosVsGastos(ingresosVsGastosData);
      setEvolucionGastos(evolucionGastosData);

    } catch (error: any) {
      setError(
        error.response?.data?.mensaje || 'Error al cargar dashboard.'
      );
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await obtenerPerfil();
        setUsuario(perfil);
      } catch (error) {
        cerrarSesion();
        navigate('/login');
      }
    };

    cargarPerfil();
  }, [navigate]);

  useEffect(() => {
    cargarDashboard();
  }, [anio, mes]);

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

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>FinTrack</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/movimientos">Movimientos</Link>
          <Link to="/presupuestos">Presupuestos</Link>
          <Link to="/dashboard">Reportes</Link>
        </nav>

        <button onClick={handleCerrarSesion} className="logout-button">
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header dashboard-header-row">
          <div>
            <h1>Dashboard financiero</h1>
            <p>Bienvenido, {usuario?.nombre || 'usuario'}.</p>
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
              onChange={(e) => setAnio(Number(e.target.value))}
              min="2000"
            />
          </div>
        </header>

        {error && <p className="error-message">{error}</p>}

        {cargando && (
          <p className="empty-text">Cargando información del dashboard...</p>
        )}

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Ingresos del mes</span>
            <strong>S/ {Number(resumen?.total_ingresos || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Gastos del mes</span>
            <strong>S/ {Number(resumen?.total_gastos || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Balance mensual</span>
            <strong>S/ {Number(resumen?.balance || 0).toFixed(2)}</strong>
          </div>

          <div className="kpi-card">
            <span>Mayor gasto</span>
            <strong>{resumen?.categoria_mayor_gasto || 'Sin gastos'}</strong>
            <small>
              S/ {Number(resumen?.total_categoria_mayor_gasto || 0).toFixed(2)}
            </small>
          </div>
        </section>

        <section className="dashboard-charts-grid">
          <div className="chart-card">
            <h2>Gastos por categoría</h2>

            {gastosCategoria.length === 0 ? (
              <p className="empty-text">No hay gastos en este periodo.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gastosCategoria}
                    dataKey="total"
                    nameKey="categoria"
                    outerRadius={100}
                    label
                  >
                    {gastosCategoria.map((item, index) => (
                      <Cell
                        key={`${item.categoria}-${index}`}
                        fill={item.color || '#2563eb'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h2>Ingresos vs gastos</h2>

            {ingresosVsGastos.length === 0 ? (
              <p className="empty-text">No hay movimientos registrados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ingresosVsGastos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ingresos" fill="#16a34a" />
                  <Bar dataKey="gastos" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card chart-card-full">
            <h2>Evolución diaria de gastos</h2>

            {evolucionGastos.length === 0 ? (
              <p className="empty-text">No hay gastos diarios en este periodo.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={evolucionGastos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;