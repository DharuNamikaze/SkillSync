import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, setAuthToken, clearAuthToken } from "./auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (credentialResponse) => {
    const token = credentialResponse.credential;
    setAuthToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (e) {
      setUser(null);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const isAuthenticated = () => Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}