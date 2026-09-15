"use client";

import React, { useState, createContext, useContext } from "react";
import { PRMSHeader } from "./prms-header";
import { PRMSSidebar } from "./prms-sidebar";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleSidebar: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface PRMSLayoutProps {
  children: React.ReactNode;
}

export function PRMSLayout({ children }: PRMSLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
    setMobileOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, toggleSidebar, mobileOpen, setMobileOpen }}
    >
      <div className="min-h-screen bg-gray-50/50 font-sans antialiased text-gray-900 selection:bg-[#c1121f]/10 selection:text-[#c1121f]">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <PRMSSidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
            {/* Header */}
            <PRMSHeader />

            {/* Page content with smooth fade entrance */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 transition-all duration-300 ease-in-out">
              <div className="mx-auto max-w-7xl animate-in fade-in-50 duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
