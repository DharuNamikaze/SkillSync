import React from 'react';
import { useAuth } from '../AuthContext';
import Sidebar from './Sidebar';
import { SidebarProvider, SidebarInset, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { PanelLeftIcon } from 'lucide-react';
import NotificationPopup from './NotificationPopup';

const Layout = ({ children, hideSidebar = false }) => {
  const { isAuthenticated } = useAuth();

  // If sidebar should be hidden (like workspace), render children directly
  if (hideSidebar) {
    return children;
  }

  // For demo purposes, always show sidebar (in production, check authentication)
  const shouldShowSidebar = true; // isAuthenticated() in production
  
  if (shouldShowSidebar) {
    return (
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          {/* Mobile top bar with hamburger trigger */}
          <MobileTopBar />
          {children}
          {/* Global notification popup */}
          <NotificationPopup />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return children;
};

const MobileTopBar = () => {
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  return (
    <div className="md:hidden sticky top-0 z-20 flex h-12 items-center gap-2 border-b-2 border-border bg-background px-2">
      <Button
        variant="neutral"
        size="icon"
        aria-label="Open menu"
        onClick={() => {
          if (isMobile) setOpenMobile(true); else toggleSidebar();
        }}
      >
        <PanelLeftIcon />
      </Button>
      <span className="font-heading">Menu</span>
    </div>
  );
};

export default Layout;
