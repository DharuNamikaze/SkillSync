import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function RedirectIfAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return children;
  }

  if (isAuthenticated()) {
    const to = location.state?.from?.pathname || "/";
    return <Navigate to={to} replace />;
  }
  return children;
}

export default RedirectIfAuth;
