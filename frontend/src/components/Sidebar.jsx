import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Briefcase, Users, MessageSquare, Calendar as CalendarIcon, Bell, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useAuth } from "../AuthContext";
import {
  Sidebar as NBSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";
import { Button } from "./ui/button";

function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to;

  return (
    <NBSidebar collapsible="offcanvas" variant="floating" className="rounded-base border-2 border-border shadow-nav">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="p-2 rounded-base flex bg-main text-main-foreground border-2 border-border items-center justify-center font-heading shadow-shadow">
            SkillSync
          </div>
          <SidebarTrigger className="md:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/">
                  <SidebarMenuButton
                    isActive={isActive("/")}
                    tooltip="Dashboard"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/projects">
                  <SidebarMenuButton
                    isActive={isActive("/projects")}
                    tooltip="Projects"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/projects") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <Briefcase />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/messages">
                  <SidebarMenuButton
                    isActive={isActive("/messages")}
                    tooltip="Messages"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/messages") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <MessageSquare />
                    <span>Messages</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/calendar">
                  <SidebarMenuButton
                    isActive={isActive("/calendar")}
                    tooltip="Calendar"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/calendar") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <CalendarIcon />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/notifications">
                  <SidebarMenuButton
                    isActive={isActive("/notifications")}
                    tooltip="Notifications"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/notifications") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <Bell />
                    <span>Notifications</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/profile">
                  <SidebarMenuButton
                    isActive={isActive("/profile")}
                    tooltip="Profile"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/profile") ? "p-6  bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <User />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/settings">
                  <SidebarMenuButton
                    isActive={isActive("/settings")}
                    tooltip="Settings"
                    className={`hover-lift-reverse transition-all duration-200 p-6 ${isActive("/settings") ? "p-6 bg-main text-main-foreground outline-border" : undefined}`}
                  >
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="min-w-0">
            <p className="text-sm font-heading truncate">{user?.name}</p>
            <p className="text-xs font-base truncate text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="neutral" className="hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none shadow-shadow transition-all duration-200" size="icon" aria-label="Logout" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </NBSidebar>
  );
}

export default Sidebar;


