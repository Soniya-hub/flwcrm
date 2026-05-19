import React from "react";

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({ children, variant = "primary", size = "md", className = "", loading, icon, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="text-sm">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
