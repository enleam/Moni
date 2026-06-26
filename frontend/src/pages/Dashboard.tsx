import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  cerrarSesion,
  obtenerPerfil,
  obtenerUsuarioLocal
} from '../services/authService';

import type { Usuario } from '../services/authService';

function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(
    obtenerUsuarioLocal()
  );

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

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>FinTrack</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/movimientos">Movimientos</Link>
          <Link to="/dashboard">Presupuestos</Link>
          <Link to="/dashboard">Reportes</Link>
        </nav>

        <button onClick={handleCerrarSesion} className="logout-button">
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bienvenido, {usuario?.nombre || 'usuario'}.</p>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Ingresos del mes</span>
            <strong>S/ 0.00</strong>
          </div>

          <div className="kpi-card">
            <span>Gastos del mes</span>
            <strong>S/ 0.00</strong>
          </div>

          <div className="kpi-card">
            <span>Balance mensual</span>
            <strong>S/ 0.00</strong>
          </div>

          <div className="kpi-card">
            <span>Presupuesto usado</span>
            <strong>0%</strong>
          </div>
        </section>

        <section className="dashboard-placeholder">
          <h2>Sprint 1 completado parcialmente</h2>
          <p>
            Ya tienes autenticación, rutas privadas y layout principal.
            En el Sprint 2 se implementará el CRUD de categorías.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;