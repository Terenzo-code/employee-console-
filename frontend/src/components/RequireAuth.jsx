import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Guards a route subtree. If allowedRoles is given, the user's decoded
// roles must intersect it (matches verifyRoles on the backend), otherwise
// any authenticated user passes.
export default function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  const loggedIn = Boolean(auth?.accessToken);
  const authorized = !allowedRoles
    || auth?.roles?.some((role) => allowedRoles.includes(role));

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!authorized) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
