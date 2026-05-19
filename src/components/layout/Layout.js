import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth < 768) {
      setMobileOpen(o => !o);
    } else {
      setCollapsed(c => !c);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Mobile backdrop — click to close sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar wrapper — fixed, slides in/out on mobile */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      </div>

      {/* Main content — no left margin on mobile, margin on desktop */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "10px", background: "#1e293b", color: "#f8fafc", fontSize: "14px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#f8fafc" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#f8fafc" } },
        }}
      />
    </div>
  );
}
