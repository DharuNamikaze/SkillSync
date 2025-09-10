import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: "8px",
  textDecoration: "none",
  color: isActive ? "#fff" : "#1a73e8",
  backgroundColor: isActive ? "#1a73e8" : "transparent",
});

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/projects" style={linkStyle}>
        Projects
      </NavLink>
      <NavLink to="/teams" style={linkStyle}>
        Teams
      </NavLink>
      <NavLink to="/notifications" style={linkStyle}>
        Notifications
      </NavLink>
      <NavLink to="/profile" style={linkStyle}>
        Profile
      </NavLink>
      <NavLink to="/settings" style={linkStyle}>
        Settings
      </NavLink>
    </nav>
  );
}

export default Navbar;


