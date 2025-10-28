import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, setAuthToken, clearAuthToken } from "./auth";
import { jwtDecode } from "jwt-decode";
import { UsersAPI } from "./lib/api";

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
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          googleId: decoded.googleId
        });
      } catch (e) {
        console.error('Token decode error:', e);
        setUser(null);
        clearAuthToken();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentialResponse) => {
    try {
      console.log('Login with credential:', credentialResponse);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_BASE}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      const data = await response.json();
      if (!data.ok || !data.token) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Set the token first
      console.log('Received token from server:', data.token ? 'exists' : 'missing');
      setAuthToken(data.token);

      // Use the token's decoded data for the user
      const decoded = jwtDecode(data.token);
      console.log('Decoded token user:', {
        id: data.user.id,
        sub: decoded.sub,
        email: decoded.email
      });
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.googleId
      });

    } catch (e) {
      console.error('Login error:', e);
      clearAuthToken(); // Clear any existing token
      setUser(null);
      throw e;
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const isAuthenticated = () => Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
