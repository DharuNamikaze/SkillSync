import React from "react";
import { clearAuthToken } from "../auth";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const logout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Account</div>
            <div className="text-gray-600 text-sm">Manage your session and preferences</div>
          </div>
          <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;


