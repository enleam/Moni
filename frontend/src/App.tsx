import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Movimientos from './pages/Movimientos';
import Presupuestos from './pages/Presupuestos';
import Reportes from './pages/Reportes';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Perfil from './pages/Perfil';
import Metas from './pages/Metas';
import Home from './pages/Home';
import VerificarEmail from './pages/VerificarEmail';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registro" element={<Registro />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/verificar-email/:token" element={<VerificarEmail />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <PrivateRoute>
            <Categorias />
          </PrivateRoute>
        }
      />

      <Route
        path="/movimientos"
        element={
          <PrivateRoute>
            <Movimientos />
          </PrivateRoute>
        }
      />

      <Route
        path="/presupuestos"
        element={
          <PrivateRoute>
            <Presupuestos />
          </PrivateRoute>
        }
      />

      <Route
        path="/metas"
        element={
          <PrivateRoute>
            <Metas />
          </PrivateRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;