import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner component
  }

  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
