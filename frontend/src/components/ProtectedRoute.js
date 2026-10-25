// ProtectedRoute.jsx
// Wraps any page that requires login
// If user is not logged in → redirects to /login automatically

import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import AppLayout from './AppLayout';

// ─── BASIC PROTECTED ROUTE ─────────────────────────────────────────────────
// Usage: <ProtectedRoute element={<Dashboard />} />
const ProtectedRoute = ({ element }) => {
  const loggedIn = authService.isLoggedIn();
  return loggedIn ? <AppLayout>{element}</AppLayout> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;


// ─── ROLE PROTECTED ROUTE ──────────────────────────────────────────────────
// Usage: <RoleProtectedRoute element={<AdminPage />} allowedRoles={['Admin']} />
export const RoleProtectedRoute = ({ element, allowedRoles }) => {
  const loggedIn = authService.isLoggedIn();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem("role");
  const hasRole = allowedRoles.includes(role);
 
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <AppLayout>{element}</AppLayout>;
};