import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./components/Projects";
import Teams from "./components/Teams";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Messages from "./components/Messages";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuth from "./components/RedirectIfAuth";
import { getAuthToken } from "./auth";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./ThemeContext";

function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    const update = () => setIsAuthed(Boolean(getAuthToken()));
    window.addEventListener("auth-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("auth-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true
        }}
      >
        {isAuthed ? <Sidebar /> : null}
        <div className={isAuthed ? "main-content" : ""}>
          <Routes>
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
            <Route path="/teams" element={<RequireAuth><Teams /></RequireAuth>} />
            <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
            <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
