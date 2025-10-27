import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./components/Projects";
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
import ProjectWorkspace from "./components/ProjectWorkspace";
import Layout from "./components/Layout";
import { ThemeProvider } from "./ThemeContext";

function App() {
  // Remove local auth state management - let AuthContext handle it

  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/projects" element={
            <RequireAuth>
              <Layout>
                <Projects />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/projects/:projectId/workspace" element={
            <RequireAuth>
              <Layout hideSidebar={true}>
                <ProjectWorkspace />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/messages" element={
            <RequireAuth>
              <Layout>
                <Messages />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/calendar" element={
            <RequireAuth>
              <Layout>
                <Calendar />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/notifications" element={
            <RequireAuth>
              <Layout>
                <Notifications />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/profile" element={
            <RequireAuth>
              <Layout>
                <Profile />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/settings" element={
            <RequireAuth>
              <Layout>
                <Settings />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
