import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

function Login() {
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);
      alert(`Welcome ${decoded.name}`);
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        text="signin_with"
        shape="pill"
      />

      <p
        style={{
          marginTop: "15px",
          color: "#555",
          fontSize: "14px",
        }}
      >
        Don’t have an account?{" "}
        <span
          style={{
            fontWeight: "bold",
            color: "#1a73e8",
            cursor: "pointer",
          }}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}

export default Login;