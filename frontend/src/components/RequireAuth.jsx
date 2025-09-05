import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";

function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default RequireAuth;


