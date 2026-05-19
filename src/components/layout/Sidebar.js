import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiGrid, FiUsers, FiCheckSquare, FiShield, FiLogOut, FiTarget, FiZap,
} from "react-icons/fi";

const navItems = [
  { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
  { to: "/leads", icon: FiTarget, label: "Leads" },
  { to: "/tasks", icon: FiCheckSquare, label: "Tasks" },
];

const adminItems = [
  { to: "/admin", icon: FiShield, label: "Admin Panel" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FiZap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm text-white leading-none">FlowCRM</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Business Automation</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && <p className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Main</p>}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            {!collapsed && <p className="px-3 py-1 mt-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Admin</p>}
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-gray-800 p-3">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-1 flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <FiLogOut size={16} className="flex-shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
