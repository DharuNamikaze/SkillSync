import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Briefcase, Users, MessageSquare, Calendar as CalendarIcon, Bell, User, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../ThemeContext";
import "../Sidebar.css";

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const { theme } = useTheme();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const largScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largScreen);
      if (largScreen) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const hamburger = document.getElementById("hamburger-button");

      if (isMobileMenuOpen && sidebar && !sidebar.contains(event.target) && 
          hamburger && !hamburger.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!isLargeScreen) {
      document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, isLargeScreen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // We'll use CSS classes instead of inline styles for theme support

  return (
    <>
      {/* Hamburger Menu Button (visible only on small screens) */}
      {!isLargeScreen && (
        <button
          id="hamburger-button"
          className="hamburger-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} color="#fff" />
          ) : (
            <Menu size={24} color="#fff" />
          )}
        </button>
      )}

      {/* Sidebar Navigation */}
      <div
        id="sidebar"
        className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <h1>SkillSync</h1>
        </div>

        <div className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <Home size={18} /> Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <Briefcase size={18} /> Projects
          </NavLink>
          <NavLink to="/teams" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <Users size={18} /> Teams
          </NavLink>
          <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <MessageSquare size={18} /> Messages
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <CalendarIcon size={18} /> Calendar
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <Bell size={18} /> Notifications
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <User size={18} /> Profile
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}>
            <SettingsIcon size={18} /> Settings
          </NavLink>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {!isLargeScreen && isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;


