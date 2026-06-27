import { NavLink, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../services/authService';

function Sidebar() {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>Moni</h2>

      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Categorías
        </NavLink>

        <NavLink
          to="/movimientos"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Movimientos
        </NavLink>

        <NavLink
          to="/presupuestos"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Presupuestos
        </NavLink>

        <NavLink
          to="/reportes"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Reportes
        </NavLink>
      </nav>

      <button onClick={handleCerrarSesion} className="logout-button">
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;