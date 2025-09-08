import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import
import { setAuthToken } from "../auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);
      setAuthToken(credentialResponse.credential);
      // Register/upsert user in backend
      try {
        await fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
          }),
        });
      } catch (e) {
        console.warn("User upsert failed", e);
      }
      alert(`Welcome ${decoded.name}`);
      navigate("/Home");
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 ">
      <h1 className="text-3xl font-semibold z-10">Welcome to SkillSync</h1>
      <p className="text-gray-600 z-10">Please sign in to continue</p>
      <span className="z-10">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          text="signin_with"
          shape="pill"
        />  
      </span>

      <div className="flex flex-row gap-4">
        <img src="src/assets/asset4.png" alt="SkillSync" 
        className="z-0 max-lg:w-80 max-lg:h-80 absolute top-0 -left-10 w-120 h-120" />
        <img src="src/assets/asset2.png" alt="SkillSync" 
        className="z-0 max-lg:w-75 max-lg:h-75  absolute bottom-0 right-0  w-100 h-100" />

      </div>


    </div>
  );
}

export default Login;