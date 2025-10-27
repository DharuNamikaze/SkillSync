import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import "./index.css";
import "./neobrutalism.css";
import "./theme-overrides.css";

// Dev-only: seed localStorage with a token from env if present and none is set
if (import.meta.env.VITE_DEV_TOKEN && !localStorage.getItem("skillsync_token")) {
  try {
    localStorage.setItem("skillsync_token", import.meta.env.VITE_DEV_TOKEN);
  } catch {
    // ignore storage errors in dev
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
