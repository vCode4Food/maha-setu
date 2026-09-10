import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
