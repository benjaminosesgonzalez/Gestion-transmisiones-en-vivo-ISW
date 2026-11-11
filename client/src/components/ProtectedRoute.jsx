import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Si no hay sesión activa, redirigir al Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se especificaron roles permitidos y el usuario no tiene permiso, redirigir a su inicio
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    const rutasPorDefecto = {
      JEFE: '/jefe/dashboard',
      JEFE_TECNICO: '/tecnico/inventario',
      CONTADOR: '/contador/finanzas',
    };
    return <Navigate to={rutasPorDefecto[user.rol] || '/login'} replace />;
  }

  // 3. Si tiene permiso, renderiza las rutas hijas junto con el marco principal
  return <Outlet />;
};
